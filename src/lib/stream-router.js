import { assertStreamRouteComponent } from './util/assert'
import { assertStreamHandlerComponent } from 'quiver-component-base/util'

import { Router } from './router'
import { defaultStreamHandler } from './default'

import { routerComponentToBuilder } from './build-router'

export class StreamRouter extends Router {
  constructor(options) {
    super(options)
    this.setDefaultHandler(defaultStreamHandler())
  }

  assertRoute(route) {
    assertStreamRouteComponent(route)
  }

  setDefaultHandler(handler) {
    assertStreamHandlerComponent(handler)
    super.setDefaultHandler(handler)
  }

  streamHandlerBuilderFn() {
    return routerComponentToBuilder(this)
  }

  get componentType() {
    return 'StreamRouter'
  }
}
