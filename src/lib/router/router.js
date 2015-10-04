import {
  staticRoute, dynamicRoute, paramRoute, regexRoute
} from '../route/constructor'

const $routeList = Symbol('@routeList')
export const $wrapHandler = Symbol('@wrapHandler')

export const routerClass = (Parent, RouteList) =>
  class Router extends Parent {
    constructor(options) {
      super(options)
      this.setSubComponent($routeList, new RouteList())
    }

    [$wrapHandler](handler) {
      return handler
    }

    addRoute(route) {
      this.routeList.addRoute(route)
      return this
    }

    addStaticRoute(path, handler) {
      return this.addRoute(staticRoute(path,
        this[$wrapHandler](handler)))
    }

    addDynamicRoute(matcher, handler) {
      return this.addRoute(dynamicRoute(matcher,
        this[$wrapHandler](handler)))
    }

    addRegexRoute(regex, matchFields, handler) {
      return this.addRoute(regexRoute(regex, matchFields,
        this[$wrapHandler](handler)))
    }

    addParamRoute(path, handler) {
      return this.addRoute(paramRoute(path,
        this[$wrapHandler](handler)))
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
