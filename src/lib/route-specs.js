import { map } from 'quiver-util/iterator'
import { asyncMap } from 'quiver-util/promise'
import { bindLoader } from 'quiver-component-base/util'

export const mapHandlers = function(mapper) {
  return this::map(routeSpec => {
    const handler = routeSpec.get('handler')
    const mapped = mapper(handler)
    return routeSpec.set('handler', mapped)
  })
}

export const asyncMapHandlers = function(mapper) {
  return this::asyncMap(async function(routeSpec) {
    const handler = routeSpec.get('handler')
    const mapped = await mapper(handler)
    return routeSpec.set('handler', mapped)
  })
}

export const handlerComponentsToLoaders = (routeSpecs, loader) =>
  routeSpecs::mapHandlers(handlerComponent =>
    bindLoader(handlerComponent, loader))

export const loadersToHandlers = (config, routeSpecs) =>
  routeSpecs::asyncMapHandlers(loader => loader(config))
