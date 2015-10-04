import { map } from 'quiver-util/iterator'
import { MapComponent } from 'quiver-component-base'
import { ImmutableMap } from 'quiver-util/immutable'

import {
  httpHandlerLoader, assertHttpHandlerComponent
} from 'quiver-component-basic/util'

import {
  componentToLoaderRoutes, buildHandlers
} from '../route-specs'

const methodIndexBuilder = methodRoutes =>
  async function(config) {
    const routes = await buildHandlers(config, methodRoutes)
    const entries = routes::map(spec =>
      ([spec.get('method'), spec.get('handler')]))

    return ImmutableMap(entries)
  }

export class MethodMap extends MapComponent {
  addRoute(method, handler) {
    if(typeof(method) !== 'string')
      throw new TypeError('method must be string')

    assertHttpHandlerComponent(handler)

    this.setComponent(method, handler)
    return this
  }

  methodSpecs() {
    return this.mapEntries()
      ::map(([method, handler]) =>
        ImmutableMap({ method, handler }))
  }

  resolve(method) {
    return this.getComponent(method)
  }

  methodIndexBuilderFn() {
    const methodSpecs = this.methodSpecs()
    const loaderRoutes = componentToLoaderRoutes(
      methodSpecs, httpHandlerLoader)

    return methodIndexBuilder([...loaderRoutes])
  }
}
