import { error } from 'quiver-util/error'
import { closeStreamable } from 'quiver-stream-util'
import { httpHandler } from 'quiver-component-basic/constructor'

import {
  httpHandlerLoader, assertHttpHandlerComponent
} from 'quiver-component-basic/util'

import { RouteList } from './route-list'
import { assertHttpRouteComponent } from '../util/assert'

const defaultHttpHandler = httpHandler(
  (requestHead, streamable) => {
    closeStreamable(streamable)
    throw error(404, 'not found')
  })
  .export()

export class HttpRouteList extends RouteList {
  constructor(options) {
    super(options)
    this.setDefaultHandler(defaultHttpHandler())
  }

  assertRoute(route) {
    assertHttpRouteComponent(route)
  }

  setDefaultHandler(handler) {
    assertHttpHandlerComponent(handler)
    return super.setDefaultHandler(handler)
  }

  get routeHandlerLoader() {
    return httpHandlerLoader
  }

  get componentType() {
    return 'StreamRouteList'
  }
}
