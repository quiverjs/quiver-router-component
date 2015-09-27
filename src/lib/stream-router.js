import { error } from 'quiver-util/error'

import {
  assertStreamHandlerComponent, streamHandlerLoader
} from 'quiver-component-basic/util'

import { Router } from './router'
import { defaultStreamHandler } from './default'
import { assertStreamRouteComponent } from './util/assert'

const indexToStreamRouter = routeIndex =>
  async function(args, streamable) {
    const path = args.get('path') || '/'
    if(typeof(path) !== 'string')
      throw error(400, 'args.path must be string')

    const route = routeIndex.resolve(path)
    if(!route) throw error(404, 'not found')

    const [ handler, extractedArgs ] = route
    const newArgs = args.merge(extractedArgs)

    return handler(newArgs, streamable)
  }

const indexBuilderToStreamRouterBuilder = routeIndexBuilder =>
  config =>
    routeIndexBuilder(config)
    .then(indexToStreamRouter)

export class StreamRouter extends Router {
  constructor(options) {
    super(options)
    this.setDefaultHandler(defaultStreamHandler())
  }

  assertRoute(route) {
    assertStreamRouteComponent(route)
  }

  setDefaultHandler(handler) {
    assertStreamHandlerComponent(handler)
    super.setDefaultHandler(handler)
  }

  streamHandlerBuilderFn() {
    const routeIndexBuilder = this.routeIndexBuilderFn()
    return indexBuilderToStreamRouterBuilder(routeIndexBuilder)
  }

  get routeHandlerLoader() {
    return streamHandlerLoader
  }

  get componentType() {
    return 'StreamRouter'
  }
}
