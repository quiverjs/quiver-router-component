import { AbstractDynamicRoute } from './dynamic'
import { paramMatcher } from './matcher'

const $paramPath = Symbol('@paramPath')

export class ParamRoute extends AbstractDynamicRoute {
  constructor(options={}) {
    const { paramPath } = options

    if(typeof(paramPath) != 'string')
      throw new TypeError('param path must be of type string')

    super(options)

    this.rawComponent[$paramPath] = paramPath
  }

  matcherFn() {
    return paramMatcher(this.paramPath())
  }

  paramPath() {
    return this[$paramPath]
  }

  get componentType() {
    return 'ParamRoute'
  }
}

export const paramRoute = (paramPath, routeHandler) =>
  new ParamRoute({ paramPath, routeHandler })
