/**
 * Converts the key/value body object into a json string
 * @param settings
 */

const FORCE_BODY_ON_PUT = true

export default function convertBody (settings) {

  if (settings.body) {
    if (typeof settings.body !== "string")
      settings._body = settings.body

    if (typeof File !== "undefined" && settings.body instanceof File || settings.isMultipart)
      return

    settings.body = JSON.stringify(settings.body)

  } else if (FORCE_BODY_ON_PUT && settings.method === "PUT")
    settings.body = "{}"

}