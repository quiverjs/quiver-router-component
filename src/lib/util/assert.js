import { assertComponent } from 'quiver-component-base/util'
import { assertStreamHandlerComponent } from 'quiver-component-base/util'

export const assertRouteComponent = route => {
  assertComponent(route, 'route must be component')

  if(!route.isRouteComponent)
    throw new TypeError('route must be instance of Route')
}

export const assertStreamRouteComponent = route => {
  assertRouteComponent(route)
  assertStreamHandlerComponent(route.routeHandler)
}
