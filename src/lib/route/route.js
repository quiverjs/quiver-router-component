import { Component } from 'quiver-component-base'
import { assertHandlerComponent } from 'quiver-component-base/util'

const $routeHandler = Symbol('@routeHandler')

export class Route extends Component {
  constructor(options={}) {
    const { routeHandler } = options

    assertHandlerComponent(routeHandler,
      'invalid options.routeHandler')

    super(options)

    this.setSubComponent($routeHandler, routeHandler)
  }

  routeSpec() {
    throw new Error('unimplemented')
  }

  get routeHandler() {
    return this.getSubComponent($routeHandler)
  }

  get isRouteComponent() {
    return true
  }

  get componentType() {
    return 'RouteComponent'
  }
}
