import {
  staticRoute, dynamicRoute, paramRoute, regexRoute
} from '../route/constructor'

const $routeList = Symbol('@routeList')

export const routerClass = (Parent, RouteList) =>
  class Router extends Parent {
    constructor(options) {
      super(options)
      this.setSubComponent($routeList, new RouteList())
    }

    addRoute(route) {
      this.routeList.addRoute(route)
      return this
    }

    addStaticRoute(path, handler) {
      return this.addRoute(staticRoute(path, handler))
    }

    addDynamicRoute(matcher, handler) {
      return this.addRoute(dynamicRoute(matcher, handler))
    }

    addRegexRoute(regex, matchFields, handler) {
      return this.addRoute(regexRoute(regex, matchFields, handler))
    }

    addParamRoute(path, handler) {
      return this.addRoute(paramRoute(path, handler))
    }

    resolve(path) {
      return this.routeList.resolve(path)
    }

    get routeList() {
      return this.getSubComponent($routeList)
    }

    setDefaultHandler(defaultHandler) {
      this.routeList.setDefaultHandler(defaultHandler)
      return this
    }

    get componentType() {
      return 'Router'
    }
  }
