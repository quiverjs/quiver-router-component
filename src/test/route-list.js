import test from 'tape'
import { simpleHandler } from 'quiver-component-basic/constructor'

import { RouteList } from '../lib/route-list'
import { staticRoute, paramRoute } from '../lib/route/constructor'

test('plain route list test', assert => {
  const fooComponent = simpleHandler(
    args => 'foo', {
      inputType: 'empty',
      outputType: 'text'
    })
    .setName('foo')

  assert.test('one static route', assert => {
    const routeList = new RouteList()
      .addRoute(staticRoute('/foo', fooComponent))

    const routeIndex = routeList.routeIndex()

    assert.equal(routeIndex.resolve('/foo')[0], fooComponent)
    assert.equal(routeIndex.resolve('/foo/')[0], null)
    assert.equal(routeIndex.resolve('/bar')[0], null)

    assert.end()
  })

  assert.test('one param route', assert => {
    const routeList = new RouteList()
      .addRoute(paramRoute('/hello/:name', fooComponent))

    const routeIndex = routeList.routeIndex()

    const [handler1, args1] = routeIndex.resolve('/hello/foo')
    assert.equal(handler1, fooComponent)
    assert.equal(args1.get('name'), 'foo')

    const [handler2, args2] = routeIndex.resolve('/hello/bar')
    assert.equal(handler2, fooComponent)
    assert.equal(args2.get('name'), 'bar')

    assert.equal(routeIndex.resolve('/hello')[0], null)
    assert.equal(routeIndex.resolve('/bar')[0], null)

    assert.end()
  })
})
