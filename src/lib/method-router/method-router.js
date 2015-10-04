import { HttpHandlerBuilder } from 'quiver-component-basic'
import { streamToHttpHandler } from 'quiver-component-basic/constructor'

import { MethodMap } from './method-map'
import { addAuxMethodHandlers } from './aux-handler'
import { methodIndexToHttpHandler } from './method-handler'

const $methodMap = Symbol('@methodMap')
const $enableAuxMethods = Symbol('@enableAuxMethods')

const methodMap = function() {
  return this.getSubComponent($methodMap)
}

const methodRouterBuilder = (indexBuilder, enableAuxMethods) =>
  async function(config) {
    let index = await indexBuilder(config)

    if(enableAuxMethods)
      index = addAuxMethodHandlers(index)

    return methodIndexToHttpHandler(index)
  }

export class MethodRouter extends HttpHandlerBuilder {
  constructor(options={}) {
    const { enableAuxMethods = true } = options
    super(options)

    this.rawComponent[$enableAuxMethods] = enableAuxMethods
    this.setSubComponent($methodMap, new MethodMap())
  }

  addRoute(method, handler) {
    if(handler.isStreamHandlerComponent) {
      handler = streamToHttpHandler(handler)
    }

    this::methodMap().addRoute(method, handler)
    return this
  }

  resolve(method) {
    return this::methodMap().resolve(method)
  }

  httpHandlerBuilderFn() {
    const indexBuilder = this::methodMap().methodIndexBuilderFn()
    return methodRouterBuilder(indexBuilder, this[$enableAuxMethods])
  }
}

export const methodRouter = () => new MethodRouter()
