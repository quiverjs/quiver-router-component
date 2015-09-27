import { ImmutableMap } from 'quiver-util/immutable'

const paramRegexString = '([^\\/]+)'
const restPathRegex = /\/:restpath$/

const escapeRegExp = string =>
  string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")

export const regexMatcher = (regex, fields=[]) =>
  path => {
    let args = ImmutableMap()

    const matches = path.match(regex)
    if(!matches) return false

    for(let i=0; i<fields.length; i++) {
      const key = fields[i]
      const match = matches[i+1]

      args = args.set(key, match)
    }

    return args
  }

export const paramMatcher = paramPath => {
  const hasRestPath = restPathRegex.test(paramPath)

  if(hasRestPath)
    paramPath = paramPath.replace(restPathRegex, '')

  const parts = paramPath.split(/(:\w+)/)

  let regexString = '^'
  let matchFields = []

  parts.forEach(part => {
    if(part[0] == ':' && part.length > 1) {
      const field = part.slice(1)
      matchFields.push(field)

      regexString += paramRegexString

    } else {
      regexString += escapeRegExp(part)
    }
  })

  if(hasRestPath) {
    regexString += '(\\/.*)'
    matchFields.push('path')
  }

  regexString += '$'

  const regex = new RegExp(regexString)

  return regexMatcher(regex, matchFields)
}
