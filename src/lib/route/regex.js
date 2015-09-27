import { DynamicRoute } from './dynamic'
import { ImmutableList } from 'quiver-util/immutable'

import { regexMatcher } from './matcher'

export class RegexRoute extends DynamicRoute {
  matcherFn() {
    regexMatcher(this.routeRegex(), this.matchFields())
  }

  routeRegex() {
    throw new Error('abstract method routeRegex() is not implemented')
  }

  matchFields() {
    throw new Error('abstract method matchFields() is not implemented')
  }

  get componentType() {
    return 'RegexRoute'
  }
}

export const regexRoute = (regex, matchFieldsArray, routeHandler) => {
  if(!(regex instanceof RegExp))
    throw new TypeError('regex must be regular expression')

  const matchFields = ImmutableList(matchFieldsArray)

  const route = new RegexRoute({ routeHandler })

  route.routeRegex = () => regex
  route.matchFields = () => matchFields

  return route
}
