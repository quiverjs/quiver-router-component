import test from 'tape'
import { asyncTest } from 'quiver-util/tape'

import {
  createConfig, loadHandler
} from 'quiver-component-base/util'

import { RequestHead } from 'quiver-http-head'

import {
  emptyStreamable, streamableToText, textToStreamable
} from 'quiver-stream-util'

import {
  httpHandler, simpleHandler
} from 'quiver-component-basic/constructor'

import { methodRouter } from '../lib/constructor'

test::asyncTest('integrated method router test', async function(assert) {
  const defineHandler = (method, result) =>
    httpHandler((requestHead, streamable) => {
      assert.equals(requestHead.method, method)
      const responseHead = requestHead.createResponseHead()
        .setStatus(200)

      return [responseHead, textToStreamable(result)]
    })

  const updateHandler = defineHandler('POST', 'update result')
  const createHandler = defineHandler('PUT', 'create result')

  const readHandler = simpleHandler(
    args => {
      const requestHead = args.get('requestHead')
      const { method } = requestHead
      assert.ok(method === 'GET' || method === 'HEAD')

      return 'read result'
    }, {
      inputType: 'empty',
      outputType: 'text'
    })

  const router = methodRouter()
    .addRoute('GET', readHandler)
    .addRoute('POST', updateHandler)
    .addRoute('PUT', createHandler)

  assert.equal(router.resolve('POST'), updateHandler)
  assert.notEqual(router.resolve('GET'), readHandler,
    'should resolve to http handler that wraps the stream handler')

  const handler = await loadHandler(createConfig(), router)

  const sendRequest = async function(method) {
    const requestHead = new RequestHead()
      .setMethod(method)
      .setPath('/')

    const [responseHead, responseStreamable] = await handler(
      requestHead, emptyStreamable())

    assert.equal(responseHead.status, '200')
    return streamableToText(responseStreamable)
  }

  const result1 = await sendRequest('GET')
  assert.equal(result1, 'read result')

  const result2 = await sendRequest('POST')
  assert.equal(result2, 'update result')

  const result3 = await sendRequest('PUT')
  assert.equal(result3, 'create result')

  const result4 = await sendRequest('HEAD')
  assert.equal(result4, '')

  assert::asyncTest('OPTIONS request', async function(assert) {
    const requestHead = new RequestHead()
      .setMethod('OPTIONS')
      .setPath('*')

    const [responseHead, responseStreamable] = await handler(
      requestHead, emptyStreamable())

    assert.equal(responseHead.status, '200')
    assert.equal(responseHead.getHeader('allow'), 'GET, POST, PUT, HEAD, OPTIONS')

    const result = await streamableToText(responseStreamable)
    assert.equal(result, '')

    assert.end()
  })

  assert::asyncTest('invalid request method', async function(assert) {
    const requestHead = new RequestHead()
      .setMethod('DELETE')
      .setPath('/')

    const [responseHead, responseStreamable] = await handler(
      requestHead, emptyStreamable())

    assert.equal(responseHead.status, '405')
    assert.equal(responseHead.getHeader('allow'), 'GET, POST, PUT, HEAD, OPTIONS')

    const result = await streamableToText(responseStreamable)
    assert.equal(result, '')

    assert.end()
  })

  assert.end()
})
