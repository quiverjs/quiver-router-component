import { map } from 'quiver-util/iterator'

import { ListNode } from 'quiver-graph'
import { StreamHandlerBuilder } from 'quiver-component-basic'

import { assertRouteComponent } from './util/assert'

const $routes = Symbol('@routes')
export const $defaultHandler = Symbol('@defaultHandler')

const routeNode = function() {
  return this.graph.getNode($routes)
}

export class Router extends StreamHandlerBuilder {
  constructor(options={}) {
    super(options)

    this.graph.setNode($routes, new ListNode())
  }

  addRoute(route) {
    this.assertRoute(route)
    this::routeNode().appendNode(route.graph)
    return this
  }

  assertRoute(route) {
    assertRouteComponent(route)
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

  routeComponents() {
    return this::routeNode().subNodes()
      ::map(node => node.transpose())
  }

  *subComponents() {
    yield* this.routeComponents()
    yield* super.subComponents()
  }

  get componentType() {
    return 'Router'
  }
}
