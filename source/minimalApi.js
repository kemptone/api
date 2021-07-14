import { jbound } from 'j'
import dissectUrl from './dissectUrl'
import buildAPIUrl, { pathWithTokens } from './buildAPIUrl'
import setHeaders from './setHeaders'
import convertBody from './convertBody'
import { handleLocalStorageAndReduxStateWrap, findAnyValueInObject } from './cachedApiCall'
import SETTINGS from './settings'
import PonyFill from 'fetch-ponyfill'
const ponyFill = PonyFill({})

const shouldUsePoly = () => {

  if (typeof fetch === "undefined")
    return true

  if (typeof window === "undefined")
    return true

  const agent = window.navigator.userAgent.toLowerCase()

  if (agent.indexOf("edge") > -1)
    return true

  if (agent.indexOf("trident/7.0") > -1)
    return true

}

const f = new Function()

function modifyByKey (settings, key) {
  let add
  if (settings[key])
    if (add = settings[key]({ ...settings, settings }))
      settings = Object.assign(settings, add)
}

const _onCommonError = settings => msg => error => {

  const ex = error || {}
    , url = typeof window === "undefined" ? "server side" : location.href
    , { type, tokens, params, filter, dispatch } = settings
    , more = { type, tokens, params, filter }

  dispatch && dispatch({
    type: settings._type() + SETTINGS.REJECTED
    , [SETTINGS.PENDING]: false
    , ...ex
    , apiPath: (settings._type())
    , [SETTINGS.API_ERROR]: true
    , status: SETTINGS.API_ERROR
  })

  if (ex && ex.e)
    delete ex.e

  if (settings.ignoreError)
    return error

  ;(SETTINGS.ON_COMMON_ERROR || new Function)(msg, url, 0, 0, ex, more )

  throw (error)

}

const minimalApi = (set, global={}) => (dispatch, getState) => {

  const s = jbound(getState)

  let api = obj => minimalApi(obj)(dispatch, getState)
    , baggage = { s, dispatch, getState, api }

  let _set

  if (Array.isArray(set))
    return set.forEach( obj => api({ ...global, ...baggage, ...obj }))

  if (typeof set === "function") {
    _set = set(baggage)
    if (!_set)
      return new Promise( resolve => { resolve() })
    else {
      api = obj => minimalApi({ serverRequest : _set.serverRequest, ...obj })(dispatch, getState)
      baggage = { s, dispatch, getState, api }
    }
  }

  const settings = Object.assign({ cacheTime : SETTINGS.DEFAULT_CACHE_TIME }, baggage, _set || set)
  const onCommonError = _onCommonError(settings)

  let timerFinished = true

  if (settings.delay) {
    timerFinished = false
    setTimeout( () => timerFinished = true, settings.delay )
  }

  modifyByKey(settings, "prefetch")

  const { type, path } = settings
    , url = (type || path || settings.url) ? dissectUrl(settings) : null
    , { onSuccess=f, onError, body } = settings

  if (!url)
    return

  const outputExtras = (function(take) {
    for (var x in settings)
      if (x === "reduxForm" || x === "s" || x === "serverRequest")
        continue
      // else if (x === "type")
      //  take._type = settings[x]
      else if (typeof settings[x] !== "function")
        take[x] = settings[x]
    
    take.isAPI = true

    return Object.assign(take, {
      body : typeof body === "string" ? JSON.parse(body) : body 
    })
  }({ }))

  const setAsPending = () => {
    dispatch && dispatch({
      ...outputExtras
      , type: settings._type() + SETTINGS.PENDING
      , apiPath: (settings._type())
      , [SETTINGS.PENDING]: true
      , status : SETTINGS.PENDING
    })
  }

  const { hasToken } = setHeaders(settings)
  convertBody(settings)

  if (settings.requiresAuthentication && !hasToken) {

    dispatch({ type : SETTINGS.UNAUTHORIZE })

    return new Promise( resolve => {
      const payload = {
        data : {}
        , IsLoggedOut : true
      }
      const r = jbound(payload)
      const response = Object.assign(
        baggage
        , payload
        , { resolve, r, isCached : true 
      })
      onSuccess && onSuccess(response)
      return response
    })
    
  }

  if (settings.storeKey) {

    let cached = handleLocalStorageAndReduxStateWrap(settings)

    if (cached) {

      return new Promise(resolve => {

        const payload = cached.response
          , r = jbound(payload)
          , response = Object.assign(baggage, payload, { resolve, r, isCached : true })

        onSuccess && onSuccess(response)

        return resolve(response)

      })
    }

  }

  setAsPending()


  const actualCall = () => (shouldUsePoly() ? ponyFill.fetch : fetch)(url, settings)
    .then(response => {
      const { statusText, status, ok } = response

      if (!ok)
        return response.json().then( data => {

          const { errors } = data
            , e = jbound(errors)
            , error_baggage = Object.assign(baggage, { ...data, e, errors, statusText, status })

          dispatch && dispatch({
            ...outputExtras
            , type: settings._type() + SETTINGS.REJECTED
            , [SETTINGS.PENDING]: false
            , apiPath: (settings._type())
            , [ SETTINGS.API_ERROR ] : true
            , status : SETTINGS.API_ERROR
          })

          if (onError)
            onError(error_baggage)

          // most likely logs you out
          if (SETTINGS.DEFAULT_ON_ERROR && status === 401)
            SETTINGS.DEFAULT_ON_ERROR(error_baggage)

          return Promise.reject(error_baggage)

        })

        if (settings.forceError1)
          return {}

        if (settings.forceError2)
          return { text : () => undefined }

        if (settings.forceError3)
          return { text : () => ""  }

        if (settings.forceError4)
          return { text : () => JSON.stringify( JSON.parse({ fard : true }) )  }

        if (settings.forceError5)
          return { text : () => JSON.stringify( JSON.parse({ fard : "<hello></hello>" }) )  }

      return response

    })
    .then(response => response.text())
    .then(text => {

      let forward = 0

      if (settings.preserveEscaping)
        return JSON.parse(text)

      else
        return JSON.parse(
          text
            .replace(/&lt;/g, "﹤") // these are not ok
            .replace(/&gt;/g, "﹥") // not ok either
            .replace(/“/g, "&quot;")
            .replace(/”/g, "&quot;")
            .replace(/&quot;/g, () => {
              forward++
              return forward % 2 ? "“" : "”"
            })
            .replace(/&#96;/g, "'") // single quotes ok, because JSON is double quoted
            .replace(/&#x27;/g, "'") // tick is ok
            .replace(/&amp;/g, "&") // & is ok because it might be in a url
        )

    })
    .then( payload => {

      const r = jbound(payload)
        , success_baggage = Object.assign(baggage, { ...outputExtras, ...payload, r })
        , finish = () => {
          dispatch && dispatch({
            ...outputExtras
            , type: settings._type() + SETTINGS.FULFILLED
            , apiPath: (settings._type())
            , payload
            , [SETTINGS.PENDING]: false
            , [SETTINGS.FULFILLED] : true
            , status : SETTINGS.FULFILLED
            , __timestamp : (new Date()).getTime()
          })
          onSuccess(success_baggage)
        }

      if (settings.preDispatch)
        settings.preDispatch({ ...success_baggage, ...settings })
      
      if (timerFinished)
        finish()
      else {
        let interval = setInterval( () => {
          if (timerFinished) {
            clearInterval(interval)
            finish()
          }
        }, 100)
      }

      return success_baggage

    })
    .catch(onCommonError( "API_ERROR : Issue with dispatching Fulfilled" ) )

  if (settings.preDelay)
    return new Promise( resolve => {

      setTimeout(() => {
        actualCall().then(() => {
          resolve()
        })
      }, settings.preDelay)

    })


  return actualCall()

}

function apiConfig (obj) {
  Object.assign(SETTINGS, obj)
}

export {
  minimalApi as default 
  , apiConfig
  , findAnyValueInObject
  , buildAPIUrl
  , pathWithTokens
}