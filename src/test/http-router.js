import test from 'tape'
import { asyncTest } from 'quiver-util/tape'
import { timeout } from 'quiver-util/promise'

import {
  createConfig, loadHandler
} from 'quiver-component-base/util'

import { RequestHead, ResponseHead } from 'quiver-http-head'

import {
  emptyStreamable, streamableToText, textToStreamable
} from 'quiver-stream-util'

import {
  httpHandlerBuilder
} from 'quiver-component-basic/constructor'

import { HttpRouter } from '../lib/router'

test::asyncTest('integrated http router test', async function(assert) {
  const loadOrder = []

  const staticHandler = httpHandlerBuilder(
    async function(config) {
      await timeout(100)
      loadOrder.push('static')

      return (requestHead, streamable) => {
        assert.equal(requestHead.method, 'GET')
        const responseHead = new ResponseHead()
          .setStatus(200)

        return [responseHead, textToStreamable('static path')]
      }
    })

  const paramHandler = httpHandlerBuilder(
    async function(config) {
      await timeout(50)
      loadOrder.push('param')

      return (requestHead, streamable) => {
        assert.equal(requestHead.method, 'POST')
        const { args } = requestHead

        assert.equal(args.get('name'), 'john')
        assert.equal(args.get('path'), '/rest/path',
          'args.path should have extracted subpath')

        assert.equal(requestHead.path, '/person/john/rest/path',
          'requestHead should have original path')

        const responseHead = new ResponseHead()
          .setStatus(200)

        return [responseHead, textToStreamable('param path')]
      }
    })

  const defaultHandler = httpHandlerBuilder(
    async function(config) {
      await timeout(10)
      loadOrder.push('default')

      return (requestHead, streamable) => {
        assert.equal(requestHead.method, 'PUT')
        assert.equal(requestHead.path, '/random/path')

        const responseHead = new ResponseHead()
          .setStatus(200)

        return [responseHead, textToStreamable('default path')]
      }
    })

  const router = new HttpRouter()
    .setDefaultHandler(defaultHandler)
    .addStaticRoute('/static', staticHandler)
    .addParamRoute('/person/:name/:restpath', paramHandler)
    .addStaticRoute('/duplicate/static', staticHandler)

  const handler = await loadHandler(createConfig(), router)

  assert.deepEqual(loadOrder, ['static', 'param', 'default'],
    'handlers should be built in series, with no repeat and default handler always last')

  const sendRequest = async function(method, path) {
    const requestHead = new RequestHead()
      .setMethod(method)
      .setPath(path)

    const [ responseHead, streamable ] = await handler(
      requestHead, emptyStreamable())

    assert.equal(responseHead.status, '200')
    return streamableToText(streamable)
  }

  const res1 = await sendRequest('GET', '/static')
  assert.equal(res1, 'static path')

  const res2 = await sendRequest('POST', '/person/john/rest/path')
  assert.equal(res2, 'param path')

  const res3 = await sendRequest('PUT', '/random/path')
  assert.equal(res3, 'default path')

  const res4 = await sendRequest('GET', '/duplicate/static')
  assert.equal(res4, 'static path')

  assert.end()
})
