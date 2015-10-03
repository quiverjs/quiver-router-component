import { bindLoader } from 'quiver-component-base/util'
import { routeIndexFromSpecs } from './route-index'

import {
  componentToLoaderRoutes, buildHandlers
} from '../route-specs'

const handlerBuilderRoutesToIndexBuilder =
(handlerBuilderRoutes, defaultHandlerBuilder) =>
  async function(config) {
    const handlerRoutes = await buildHandlers(
      config, handlerBuilderRoutes)

    const defaultHandler = await defaultHandlerBuilder(config)

    return routeIndexFromSpecs(handlerRoutes, defaultHandler)
  }

export const componentRoutesToIndexBuilder =
(componentRouteSpecs, defaultHandlerComponent, handlerLoader) => {
  const loaderRoutes = componentToLoaderRoutes(
    componentRouteSpecs, handlerLoader)

  const defaulHandlerLoader = bindLoader(
    defaultHandlerComponent, handlerLoader)

  return handlerBuilderRoutesToIndexBuilder(
    [...loaderRoutes], defaulHandlerLoader)
}
