import { error } from 'quiver-util/error'
import { HttpHandlerBuilder } from 'quiver-component-basic'
import { streamToHttpHandler } from 'quiver-component-basic/constructor'

import { routerClass, $wrapHandler } from './router'
import { HttpRouteList } from '../route-list'

const indexToHttpRouter = routeIndex =>
  async function(requestHead, streamable) {
    const path = requestHead.args.get('path') || requestHead.path || '/'
    if(typeof(path) !== 'string')
      throw error(400, 'request path must be string')

    const [ handler, extractedArgs ] = routeIndex.resolve(path)
    if(!handler) throw error(404, 'not found')

    const newArgs = requestHead.args.merge(extractedArgs)
    const newRequestHead = requestHead.setArgs(newArgs)

    return handler(newRequestHead, streamable)
  }

const indexBuilderToHttpRouterBuilder = routeIndexBuilder =>
  config =>
    routeIndexBuilder(config)
    .then(indexToHttpRouter)

const Router = routerClass(HttpHandlerBuilder, HttpRouteList)

export class HttpRouter extends Router {
  httpHandlerBuilderFn() {
    const routeIndexBuilder = this.routeList.routeIndexBuilderFn()
    return indexBuilderToHttpRouterBuilder(routeIndexBuilder)
  }

  [$wrapHandler](handler) {
    if(handler.isStreamHandlerComponent) {
      return streamToHttpHandler(handler)
    }

    return handler
  }

  get componentType() {
    return 'HttpRouter'
  }
}
