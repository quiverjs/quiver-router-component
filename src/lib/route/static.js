import { Route } from './route'
import { ImmutableMap } from 'quiver-util/immutable'

const $staticPath = Symbol('@staticPath')

export class StaticRoute extends Route {
  constructor(options={}) {
    const { staticPath } = options

    if(typeof(staticPath) != 'string')
      throw new TypeError('options.staticPath must be string')

    super(options)

    this.rawComponent[$staticPath] = staticPath
  }

  routeSpec() {
    return ImmutableMap()
      .set('routeType', 'static')
      .set('path', this.staticPath())
      .set('handler', this.routeHandler)
  }

  staticPath() {
    return this[$staticPath]
  }

  get componentType() {
    return 'StaticRoute'
  }

  get routeType() {
    return 'static'
  }
}

export const staticRoute = (staticPath, routeHandler) =>
  new StaticRoute({ staticPath, routeHandler })
