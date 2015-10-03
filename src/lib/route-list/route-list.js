import { map } from 'quiver-util/iterator'

import { Component, ListComponent } from 'quiver-component-base'
import { handleableLoader } from 'quiver-component-base/util'

import { assertRouteComponent } from '../util/assert'
import {
  routeIndexFromSpecs,
  componentRoutesToIndexBuilder
} from '../route-index'

const $routeList = Symbol('@routeList')
const $defaultHandler = Symbol('@defaultHandler')

export class RouteList extends Component {
  constructor(options) {
    super(options)

    this.setSubComponent($routeList, new ListComponent())
  }

  addRoute(route) {
    this.assertRoute(route)
    this.rawList.appendComponent(route)
    return this
  }

  assertRoute(route) {
    assertRouteComponent(route)
  }

  routeIndexBuilderFn() {
    const componentRoutes = this.routeSpecs()
    const defaultHandler = this.defaultHandler
    const handlerLoader = this.routeHandlerLoader

    if(!defaultHandler)
      throw new Error('default route handler is not set')

    return componentRoutesToIndexBuilder(
      componentRoutes, defaultHandler, handlerLoader)
  }

  get routeHandlerLoader() {
    return handleableLoader
  }

  get defaultHandler() {
    return this.getSubComponent($defaultHandler)
  }

  setDefaultHandler(defaultHandler) {
    this.setSubComponent($defaultHandler, defaultHandler)
    return this
  }

  routeSpecs() {
    return this.routeComponents()::map(
      route => route.routeSpec())
  }

  routeIndex() {
    return routeIndexFromSpecs(
      this.routeSpecs(), this.defaultHandler)
  }

  resolve(path) {
    return this.routeIndex().resolve(path)
  }

  routeComponents() {
    return this.rawList.subComponents()
  }

  get rawList() {
    return this.getSubComponent($routeList)
  }

  get componentType() {
    return 'RouteList'
  }
}
