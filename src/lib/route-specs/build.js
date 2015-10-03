import { bindLoader } from 'quiver-component-base/util'

import { mapHandlers, asyncMapHandlers } from './map'

export const componentToLoaderRoutes = (routeSpecs, loader) =>
  routeSpecs::mapHandlers(handlerComponent =>
    bindLoader(handlerComponent, loader))

export const buildHandlers = (config, routeSpecs) =>
  routeSpecs::asyncMapHandlers(loader => loader(config))
