import j from 'j'

export default function buildParams (settings) {

  let { params, filter, getState } = settings

  const ecoid = j("user.data.ec.organization_id", getState)

  let str = '?'
  let x, y

  if (ecoid)
    params = {
      ecoid
      , ...(params || {})
    }


  if (!params)
    return ""

  // modify the params so localStorage check works
  settings.params = params

  for (x in params)
    if (params[x] !== undefined && params[x] !== "")
      str += x + '=' + encodeURIComponent(params[x]) + '&'

  str = str.replace(/\&$/, '')

  if (filter) {
    let filter_str = ""
    for (y in filter)
      if (filter[y] !== undefined && filter[y] !== "")
        filter_str += y + '::' + encodeURIComponent(filter[y]) + '|'

    filter_str = filter_str.replace(/\|$/, '')

    return str += "&filter=" + filter_str

  }

  return str

}