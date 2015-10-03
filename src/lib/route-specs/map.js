import { map } from 'quiver-util/iterator'
import { asyncMap } from 'quiver-util/promise'

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
