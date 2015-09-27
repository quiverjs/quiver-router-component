import { Route } from './route'
import { ImmutableMap } from 'quiver-util/immutable'
import { assertFunction } from 'quiver-util/assert'

export class DynamicRoute extends Route {
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

export const dynamicRoute = (matcher, routeHandler) => {
  assertFunction(matcher, 'matcher must be function')

  const route = new DynamicRoute({ routeHandler })
  route.matcherFn = () => matcher

  return route
}
