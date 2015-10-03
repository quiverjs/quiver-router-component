import { assertComponent } from 'quiver-component-base/util'
import {
  assertStreamHandlerComponent, assertHttpHandlerComponent
} from 'quiver-component-basic/util'

export const assertRouteComponent = route => {
  assertComponent(route, 'route must be component')

  if(!route.isRouteComponent)
    throw new TypeError('route must be instance of Route')
}

export const assertStreamRouteComponent = route => {
  assertRouteComponent(route)
  assertStreamHandlerComponent(route.routeHandler)
}

export const assertHttpRouteComponent = route => {
  assertRouteComponent(route)
  assertHttpHandlerComponent(route.routeHandler)
}
