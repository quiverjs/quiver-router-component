import { DynamicRoute } from './dynamic'
import { paramMatcher } from './matcher'

export class ParamRoute extends DynamicRoute {
  matcherFn() {
    return paramMatcher(this.paramPath())
  }

  paramPath() {
    throw new Error('abstract method paramPath() is not defined')
  }

  get componentType() {
    return 'ParamRoute'
  }
}

export const paramRoute = (paramPath, routeHandler) => {
  if(typeof(paramPath) != 'string')
    throw new TypeError('param path must be of type string')

  const route = new ParamRoute({ routeHandler })

  route.paramPath = () => paramPath

  return route
}
