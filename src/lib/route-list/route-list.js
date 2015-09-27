import { map } from 'quiver-util/iterator'

import { ListComponent } from 'quiver-component-base'
import { handleableLoader } from 'quiver-component-base/util'

import { assertRouteComponent } from '../util/assert'
import {
  routeIndexFromSpecs,
  componentRoutesToIndexBuilder
} from '../route-index'

export const $defaultHandler = Symbol('@defaultHandler')

export class RouteList extends ListComponent {
  addRoute(route) {
    this.assertRoute(route)
    return this.appendComponent(route)
  }

  assertRoute(route) {
    assertRouteComponent(route)
  }

  routeIndexBuilderFn() {
    const componentRoutes = this.routeSpecs()
    const defaultHandler = this.defaultHandler()
    const handlerLoader = this.routeHandlerLoader

    if(!defaultHandler)
      throw new Error('default route handler is not set')

    return componentRoutesToIndexBuilder(
      componentRoutes, defaultHandler, handlerLoader)
  }

  get routeHandlerLoader() {
    return handleableLoader
  }

  defaultHandler() {
    return this.getSubComponents($defaultHandler)
  }

  setDefaultHandler(defaultHandler) {
    return this.setSubComponents($defaultHandler, defaultHandler)
  }

  routeSpecs() {
    return this.routeComponents::map(
      route => route.routeSpec())
  }

  resolve(path) {
    const routeIndex = routeIndexFromSpecs(
      this.routeSpecs, this.defaultHandler)

    return routeIndex.resolve(path)
  }

  routeComponents() {
    return this.subComponents()
  }

  get componentType() {
    return 'RouteList'
  }
}
