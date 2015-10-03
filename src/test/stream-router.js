import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { timeout } from 'quiver-util/promise'

import {
  createConfig, loadHandler
} from 'quiver-component-base/util'

import {
  createArgs, simpleHandlerLoader
} from 'quiver-component-basic/util'

import {
  simpleHandlerBuilder, httpHandler
} from 'quiver-component-basic/constructor'

import { StreamRouter } from '../lib/router'
import { staticRoute } from '../lib/route/constructor'

test::asyncTest('integrated stream router test', async function(assert) {
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

      return args => {
        assert.equal(args.get('path'), '/random/path')
        return 'default path'
      }
    }, {
      inputType: 'empty',
      outputType: 'text'
    })

  const router = new StreamRouter()
    .setDefaultHandler(defaultHandler)
    .addStaticRoute('/static', staticHandler)
    .addParamRoute('/person/:name/:restpath', paramHandler)
    .addStaticRoute('/duplicate/static', staticHandler)
    .setLoader(simpleHandlerLoader('empty', 'text'))

  assert.throws(() => router.addRoute(paramHandler),
    'should not able to add non-route component')

  const httpRoute = staticRoute('/http/route', httpHandler(
    (requestHead, requestStreamable) => {
      throw new Error('not implemented')
    }))

  assert.throws(() => router.addRoute(httpRoute),
    'should not able to add non-stream handler component')

  const handler = await loadHandler(createConfig(), router)

  assert.deepEqual(loadOrder, ['static', 'param', 'default'],
    'handlers should be built in series, with no repeat and default handler always last')

  const sendRequest = path =>
    handler(createArgs({ path }))

  const res1 = await sendRequest('/static')
  assert.equal(res1, 'static path')

  const res2 = await sendRequest('/person/john/rest/path')
  assert.equal(res2, 'param path')

  const res3 = await sendRequest('/random/path')
  assert.equal(res3, 'default path')

  const res4 = await sendRequest('/duplicate/static')
  assert.equal(res4, 'static path')

  assert.end()
})
