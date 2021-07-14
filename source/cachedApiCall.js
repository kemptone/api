import { jbound } from 'j'
import SETTINGS from './settings'
import _ from 'underscore'

export function findAnyValueInObject (obj, x) {
  for (x in obj)
    if (x === SETTINGS.PENDING)
      continue
    else if (!(obj[x] instanceof Object))
      return true
    else if (findAnyValueInObject(obj[x]))
      return true
}

function defaultStoreCheck ({ tokens, params, filter, body, r, settings }) {

  // if (body || r.j("body"))
  //   debugger

  r.j("__timestamp")
  const newParams = { tokens, params, body, filter }
  const oldParams = { tokens : r.j("tokens"), params : r.j("params"), body : r.j("body"), filter : r.j("filter") }
  const now = (new Date()).getTime()

  const equalProps = _.isEqual(newParams, oldParams)
  const notTooOld = r.j("__timestamp", now) > now - ( settings.cacheTime || (1000 * 60 * 5)) 

  return equalProps && notTooOld
}

function getFromStore ({ storeKey, s }) {

  const value = s.j(storeKey) || {}

  if (value[ SETTINGS.PENDING ])
    return

  if (findAnyValueInObject(value))
    return value

}

export const handleLocalStorageAndReduxStateWrap = settings => {

  const { storeKey, storeCheck = defaultStoreCheck } = settings

  if (!storeKey)
    return

  const fromStore = getFromStore(settings)
    , response = fromStore

  if (!response)
    return

  let sc = storeCheck({ ...settings, defaultStoreCheck, r : jbound(response), data : response.data, response, settings })

  if (!sc)
    return

  return { response, fromStore, storeKey, ...response }

}