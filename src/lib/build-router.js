import { error } from 'quiver-util/error'
import { bindLoader } from 'quiver-component-base/util'
import { streamHandlerLoader } from 'quiver-component-basic/util'
import {
  handlerComponentsToLoaders, loadersToHandlers
} from './route-specs'

import { routeIndexFromSpecs } from './route-index'

const routerHandler = (routeIndex, defaultHandler) =>
  async function(args, streamable) {
    const path = args.get('path') || '/'
    if(typeof(path) !== 'string')
      throw error(400, 'args.path must be string')

    const route = routeIndex.resolve(path)
    if(!route) return defaultHandler(args, streamable)

    const [ handler, extractedArgs ] = route
    const newArgs = args.merge(extractedArgs)

    return handler(newArgs, streamable)
  }

const loaderRoutesToBuilder = (loaderRoutes, defaultLoader) =>
  async function(config) {
    const defaultHandler = await defaultLoader(config)

    const handlerRoutes = await loadersToHandlers(
      config, loaderRoutes)

    const routeIndex = routeIndexFromSpecs(handlerRoutes)

    return routerHandler(routeIndex, defaultHandler)
  }

export const routerComponentToBuilder = component => {
  const loaderRoutes = handlerComponentsToLoaders(
    component.routeSpecs(), streamHandlerLoader)

  const defaultLoader = bindLoader(
    component.defaultHandler, streamHandlerLoader)

  return loaderRoutesToBuilder([...loaderRoutes], defaultLoader)
}
