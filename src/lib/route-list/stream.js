import { error } from 'quiver-util/error'
import { closeStreamable } from 'quiver-stream-util'
import { streamHandler } from 'quiver-component-basic/constructor'

import {
  streamHandlerLoader, assertStreamHandlerComponent
} from 'quiver-component-basic/util'

import { RouteList } from './route-list'
import { assertStreamRouteComponent } from '../util/assert'

const defaultStreamHandler = streamHandler(
  (args, streamable) => {
    closeStreamable(streamable)
    throw error(404, 'not found')
  })
  .export()

export class StreamRouteList extends RouteList {
  constructor(options) {
    super(options)
    this.setDefaultHandler(defaultStreamHandler())
  }

  assertRoute(route) {
    assertStreamRouteComponent(route)
  }

  setDefaultHandler(handler) {
    assertStreamHandlerComponent(handler)
    return super.setDefaultHandler(handler)
  }

  get routeHandlerLoader() {
    return streamHandlerLoader
  }

  get componentType() {
    return 'StreamRouteList'
  }
}
