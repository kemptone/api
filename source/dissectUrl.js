import buildParams from "./buildParams"
import buildAPIUrl from './buildAPIUrl'
import parseMethod from './parseMethod'

/**
 * Used to replace the API_PATH when tokens are present
 * @param settings {object} api object
 * @returns {string}
 */
export default function dissectUrl (settings) {

  const params = buildParams(settings)

  parseMethod(settings)

  // if the PATH starts with ~ then assume it's going to local server, not to API server
  if (settings.type.substr(0, 1) === "~")
    return settings.type.substr(1) + params

  if (settings.url)
    return settings.url + params

  if (settings.path)
    return buildAPIUrl( settings.path, settings.tokens ) + params

  if (settings.type)
    return buildAPIUrl( settings.type, settings.tokens ) + params

}