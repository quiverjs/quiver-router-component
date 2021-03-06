import { error } from 'quiver-util/error'
import { StreamHandlerBuilder } from 'quiver-component-basic'

import { routerClass } from './router'
import { StreamRouteList } from '../route-list'

const indexToStreamRouter = routeIndex =>
  async function(args, streamable) {
    const path = args.get('path') || '/'
    if(typeof(path) !== 'string')
      throw error(400, 'args.path must be string')

    const [ handler, extractedArgs ] = routeIndex.resolve(path)
    if(!handler) throw error(404, 'not found')

    const newArgs = args.merge(extractedArgs)

    return handler(newArgs, streamable)
  }

const indexBuilderToStreamRouterBuilder = routeIndexBuilder =>
  config =>
    routeIndexBuilder(config)
    .then(indexToStreamRouter)

const Router = routerClass(StreamHandlerBuilder, StreamRouteList)

export class StreamRouter extends Router {
  streamHandlerBuilderFn() {
    const routeIndexBuilder = this.routeList.routeIndexBuilderFn()
    return indexBuilderToStreamRouterBuilder(routeIndexBuilder)
  }

  get componentType() {
    return 'StreamRouter'
  }
}

export const streamRouter = () => new StreamRouter()
