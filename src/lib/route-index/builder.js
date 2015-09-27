import { bindLoader } from 'quiver-component-base/util'
import { mapHandlers, asyncMapHandlers } from './route-specs'
import { routeIndexFromSpecs } from './route-index'

const componentRoutesToLoaderRoutes = (routeSpecs, loader) =>
  routeSpecs::mapHandlers(handlerComponent =>
    bindLoader(handlerComponent, loader))

const handlerBuildersToHandlers = (config, routeSpecs) =>
  routeSpecs::asyncMapHandlers(loader => loader(config))

const handlerBuilderRoutesToIndexBuilder =
(handlerBuilderRoutes, defaultHandlerBuilder) =>
  async function(config) {
    const defaultHandler = await defaultHandlerBuilder(config)

    const handlerRoutes = await handlerBuildersToHandlers(
      config, handlerBuilderRoutes)

    return routeIndexFromSpecs(handlerRoutes, defaultHandler)
  }

export const componentRoutesToIndexBuilder =
(componentRouteSpecs, defaultHandlerComponent, handlerLoader) => {
  const loaderRoutes = componentRoutesToLoaderRoutes(
    componentRouteSpecs, handlerLoader)

  const defaulHandlerLoader = bindLoader(
    defaultHandlerComponent, handlerLoader)

  return handlerBuilderRoutesToIndexBuilder(
    [...loaderRoutes], defaulHandlerLoader)
}
