import {
  ImmutableMap, ImmutableList
} from 'quiver-util/immutable'

const $rawIndex = Symbol('@rawIndex')

const initRawIndex = ImmutableMap()
  .set('staticRoutes', ImmutableMap())
  .set('dynamicRoutes', ImmutableList())
  .set('defaultHandler', null)

const emptyArgs = ImmutableMap()

export class RouteIndex {
  constructor(rawIndex=initRawIndex) {
    this[$rawIndex] = rawIndex
  }

  setIndex(newIndex) {
    return new RouteIndex(newIndex)
  }

  addStaticRoute(staticPath, handler) {
    const { rawIndex, staticRoutes } = this

    if(staticRoutes.has(staticPath))
      throw new Error(`static path conflicts with existing routes: ${staticPath}`)

    const newIndex = rawIndex.set('staticRoutes',
      staticRoutes.set(staticPath, handler))

    return this.setIndex(newIndex)
  }

  addDynamicRoute(matcher, handler) {
    const { rawIndex, dynamicRoutes } = this

    const newIndex = rawIndex.set('dynamicRoutes',
      dynamicRoutes.push([ matcher, handler ]))

    return this.setIndex(newIndex)
  }

  setDefaultHandler(handler) {
    return this.rawIndex.set('defaultHandler', handler)
  }

  resolve(path) {
    const staticHandler = this.staticRoutes.get(path)
    if(staticHandler) return [staticHandler, emptyArgs]

    for(let [matcher, handler] of this.dynamicRoutes.values()) {
      const extractedArgs = matcher(path)

      if(extractedArgs) return [handler, extractedArgs]
    }

    return this.defaultHandler
  }

  get rawIndex() {
    return this[$rawIndex]
  }

  get staticRoutes() {
    return this.rawIndex.get('staticRoutes')
  }

  get dynamicRoutes() {
    return this.rawIndex.get('dynamicRoutes')
  }

  get defaultHandler() {
    return this.rawIndex.get('defaultHandler')
  }
}

export const routeIndexFromSpecs = (routeSpecs, defaultHandler) => {
  let index = new RouteIndex()

  for(let routeSpec of routeSpecs) {
    const routeType = routeSpec.get('routeType')
    const handler = routeSpec.get('handler')

    if(routeType === 'static') {
      const path = routeSpec.get('path')
      index = index.addStaticRoute(path, handler)

    } else if(routeType === 'dynamic') {
      const matcher = routeSpec.get('matcher')
      index = index.addDynamicRoute(matcher, handler)

    } else {
      throw new Error(`invalid route type ${routeType} for route specs: ${routeSpecs}`)
    }
  }

  index = index.setDefaultHandler(defaultHandler)

  return index
}
