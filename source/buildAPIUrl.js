import SETTINGS from './settings'

/**
 *
 * @param { string } path
 * @param { object } tokens
 * @param clean [boolean] optional, removes the post | get | put | delete
 * @returns { string }
 */
function buildAPIUrl(path, tokens) {
  return getApiHost() + pathWithTokens.apply(this, arguments)
}

function pathWithTokens (path = "", tokens = {}, clean) {

  if (typeof path !== "string" || typeof tokens !== "object")
    return path

  Object.keys(tokens).forEach(function(key) {
    path = path.replace( new RegExp(':' + key, 'g'), tokens[key])
  })

  if (clean)
    return path.split(" ")[1] || path.split(" ")[0]

  return path

}

function getApiHost() {

  const api_port = parseInt(SETTINGS.APIPORT)

  const P = api_port !== 80 ? `:${api_port}` : ''

  if (SETTINGS.ISHTTPS)
    return "https://" + SETTINGS.APIHOSTNAME + P
  else
    return "http://" + SETTINGS.APIHOSTNAME + P

}

export {
  buildAPIUrl as default
  , pathWithTokens
}
