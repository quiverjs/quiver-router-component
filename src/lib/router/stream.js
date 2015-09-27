import { error } from 'quiver-util/error'
import { StreamHandlerBuilder } from 'quiver-component-basic'

import { StreamRouteList } from './route-list'

const $routeList = Symbol('@routeList')

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

export class StreamRouter extends StreamHandlerBuilder {
  constructor(options) {
    super(options)
    this.setSubComponent($routeList, new StreamRouteList())
  }

  addRoute(route) {
    this.routeList.addRoute(route)
    return this
  }

  streamHandlerBuilderFn() {
    const routeIndexBuilder = this.routeList.routeIndexBuilderFn()
    return indexBuilderToStreamRouterBuilder(routeIndexBuilder)
  }

  get routeList() {
    return this.getSubComponent($routeList)
  }

  get componentType() {
    return 'StreamRouter'
  }
}
