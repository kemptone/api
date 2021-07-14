import CookieDough from 'cookie-dough'
import SETTINGS from './settings'

/**
 * sets the request headers
 * @param settings
 */
export default function setHeaders (settings) {

  const { serverRequest } = settings
    , cookie = serverRequest ? new CookieDough(serverRequest) : CookieDough()
    , authToken = cookie.get(SETTINGS.COOKIE_AUTHORIZATION) || 'undefined'
    , Authorization = `Bearer ${authToken}`
    , baseHeaders = { Authorization }

  settings.mode = "cors"

  if (settings.type.substr(0, 1) === "~")
    settings.credentials = 'include'

  // if the request body should be multipart/form-data,
  // don't set the 'Content-Type' header so that the
  // browser will do it automatically, along with the
  // appropriate 'boundary' string
  if (!settings.isMultipart)
    if (settings.method !== "GET")
      baseHeaders['Content-Type'] = 'application/json'

  settings.headers = Object.assign({ ...baseHeaders }, settings.headers)

  return {
    mode : settings.mode
    , authToken
    , Authorization
    , hasToken : authToken !== "undefined"
  }

}