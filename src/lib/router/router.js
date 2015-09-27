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
