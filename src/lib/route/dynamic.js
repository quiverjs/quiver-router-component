import { Route } from './route'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertFunction } from 'quiver-util/assert'

const $matcherFn = Symbol('@matcherFn')

export class AbstractDynamicRoute extends Route {
  routeSpec() {
    return ImmutableMap()
      .set('routeType', 'dynamic')
      .set('matcher', this.matcherFn())
      .set('handler', this.routeHandler)
  }

  matcherFn() {
    throw new Error('abstract method matcherFn() is not implemented')
  }

  get componentType() {
    return 'DynamicRoute'
  }

  get routeType() {
    return 'dynamic'
  }
}

export class DynamicRoute extends AbstractDynamicRoute {
  constructor(options={}) {
    const { matcherFn } = options
    assertFunction(matcherFn, 'matcherFn must be function')

    super(options)

    this.rawComponent[$matcherFn] = matcherFn
  }

  matcherFn() {
    return this[$matcherFn]
  }
}

export const dynamicRoute = (matcherFn, routeHandler) =>
  new DynamicRoute({ matcherFn, routeHandler })
