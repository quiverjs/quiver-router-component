import { ResponseHead } from 'quiver-http-head'
import { closeStreamable, emptyStreamable } from 'quiver-stream-util'

export const methodIndexToHttpHandler = methodIndex => {
  const allowedMethods = [...methodIndex.keys()].join(', ')

  return async function(requestHead, requestStreamable) {
    const { method } = requestHead
    const handler = methodIndex.get(method)

    if(handler) return handler(requestHead, requestStreamable)

    closeStreamable(requestStreamable)
    const responseHead = new ResponseHead()
      .setStatus(405)
      .setHeader('content-length', '0')
      .setHeader('allow', allowedMethods)

    return [ responseHead, emptyStreamable() ]
  }
}
