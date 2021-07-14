/**
 * Get the request method out of the type, extends the settings object with value
 * @param settings
 * @returns {*}
 */
export default function parseMethod (settings) {

  settings._type = settings.type

  const type = typeof settings.type === "function" ? settings.type() || "" : settings.type || ""

  const [ part1, part2 ] = type.split(" ")

  if (!part2)
    return settings

  settings.originalType = settings.type
  settings.method = part1.toUpperCase()
  settings.type = part2

  return settings

}