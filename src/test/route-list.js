import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { timeout } from 'quiver-util/promise'

import { createConfig } from 'quiver-component-base/util'

import { emptyStreamable, streamableToText } from 'quiver-stream-util'

import {
  simpleHandler, simpleHandlerBuilder
} from 'quiver-component-basic/constructor'

import { RouteList, StreamRouteList } from '../lib/route-list'
import { staticRoute, paramRoute } from '../lib/route/constructor'

test('plain route list test', assert => {
  assert.test('one static route', assert => {
    const fooComponent = simpleHandler(
      args => 'foo result', {
        inputType: 'empty',
        outputType: 'text'
      })
      .setName('foo')

    const routeList = new RouteList()
      .addRoute(staticRoute('/foo', fooComponent))

    const routeIndex = routeList.routeIndex()

    assert.equal(routeIndex.resolve('/foo')[0], fooComponent)
    assert.equal(routeIndex.resolve('/foo/')[0], null)
    assert.equal(routeIndex.resolve('/bar')[0], null)

    assert.end()
  })

  assert.test('one param route', assert => {
    const barComponent = simpleHandler(
      args => 'bar result', {
        inputType: 'empty',
        outputType: 'text'
      })
      .setName('bar')

    const routeList = new RouteList()
      .addRoute(paramRoute('/hello/:name', barComponent))

    const routeIndex = routeList.routeIndex()

    const [handler1, args1] = routeIndex.resolve('/hello/foo')
    assert.equal(handler1, barComponent)
    assert.equal(args1.get('name'), 'foo')

    const [handler2, args2] = routeIndex.resolve('/hello/bar')
    assert.equal(handler2, barComponent)
    assert.equal(args2.get('name'), 'bar')

    assert.equal(routeIndex.resolve('/hello')[0], null)
    assert.equal(routeIndex.resolve('/bar')[0], null)

    assert.end()
  })

  assert::asyncTest('combined route index builder', async function(assert) {
    const loadOrder = []

    const staticHandler = simpleHandlerBuilder(
      async function(config) {
        await timeout(100)
        loadOrder.push('static')

        return args => {
          return 'static path'
        }
      }, {
        inputType: 'empty',
        outputType: 'text'
      })

    const paramHandler = simpleHandlerBuilder(
      async function(config) {
        await timeout(50)
        loadOrder.push('param')

        return args => {
          assert.equal(args.get('name'), 'john')
          assert.equal(args.get('path'), '/rest/path')
          return 'param path'
        }
      }, {
        inputType: 'empty',
        outputType: 'text'
      })

    const defaultHandler = simpleHandlerBuilder(
      async function(config) {
        await timeout(10)
        loadOrder.push('default')

        return args => 'default path'
      }, {
        inputType: 'empty',
        outputType: 'text'
      })

    const routeList = new StreamRouteList()
      .setDefaultHandler(defaultHandler)
      .addRoute(staticRoute('/static', staticHandler))
      .addRoute(paramRoute('/person/:name/:restpath', paramHandler))

    const indexBuilder = routeList.routeIndexBuilderFn()
    const routeIndex = await indexBuilder(createConfig())

    assert.deepEqual(loadOrder, ['static', 'param', 'default'],
      'handlers should be built in series, with default handler always last')

    const sendRequest = async function(path) {
      const [handler, args] = routeIndex.resolve(path)
      assert.ok(handler)
      assert.ok(args)

      const streamable = await handler(args, emptyStreamable())
      return streamableToText(streamable)
    }

    const res1 = await sendRequest('/static')
    assert.equal(res1, 'static path')

    const res2 = await sendRequest('/person/john/rest/path')
    assert.equal(res2, 'param path')

    const res3 = await sendRequest('/random/path')
    assert.equal(res3, 'default path')

    assert.end()
  })
})
