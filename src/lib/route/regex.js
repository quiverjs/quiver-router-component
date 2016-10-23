import { ImmutableList, isImmutableList } from 'quiver-util/immutable'

import { regexMatcher } from './matcher'
import { AbstractDynamicRoute } from './dynamic'

const $routeRegex = Symbol('@routeRegex')
const $matchFields = Symbol('@matchFields')

export class RegexRoute extends AbstractDynamicRoute {
  constructor(options={}) {
    const { routeRegex, matchFields } = options

    if(!(routeRegex instanceof RegExp))
      throw new TypeError('routeRegex must be regular expression')

    if(!isImmutableList(matchFields))
      throw new TypeError('matchFields must be ImmutableList')

    super(options)

    this.rawComponent[$routeRegex] = routeRegex
    this.rawComponent[$matchFields] = matchFields
  }

  matcherFn() {
    regexMatcher(this.routeRegex(), [...this.matchFields()])
  }

  routeRegex() {
    return this[$routeRegex]
  }

  matchFields() {
    return this[$matchFields]
  }

  get componentType() {
    return 'RegexRoute'
  }
}

export const regexRoute = (routeRegex, matchFields, routeHandler) =>
  new RegexRoute({
    routeRegex, routeHandler,
    matchFields: ImmutableList(matchFields)
  })
