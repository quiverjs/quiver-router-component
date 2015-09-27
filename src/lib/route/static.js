import { Route } from './route'
import { ImmutableMap } from 'quiver-util/immutable'

export class StaticRoute extends Route {
  routeSpec() {
    return ImmutableMap()
      .set('routeType', 'static')
      .set('path', this.staticPath)
      .set('handler', this.routeHandler)
  }

  staticPath() {
    throw new Error('abstract method staticPath() is not implemented')
  }

  get componentType() {
    return 'StaticRoute'
  }

  get routeType() {
    return 'static'
  }
}

export const staticRoute = (staticPath, routeHandler) => {
  if(typeof(staticPath) != 'string')
    throw new TypeError('options.staticPath must be string')

  const route = new StaticRoute({ routeHandler })

  route.staticPath = () => staticPath

  return route
}
