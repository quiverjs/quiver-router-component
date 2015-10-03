import { ResponseHead } from 'quiver-http-head'
import { closeStreamable, emptyStreamable } from 'quiver-stream-util'

const OPTIONSHandler = methods => {
  const allowedMethods = [...methods, 'OPTIONS'].join(', ')

  return async function(requestHead, requestStreamable) {
    closeStreamable(requestStreamable)

    const responseHead = new ResponseHead()
      .setStatus(200)
      .setHeader('content-length', '0')
      .setHeader('allow', allowedMethods)

    return [ responseHead, emptyStreamable() ]
  }
}

const HEADHandler = GETHandler =>
  async function(requestHead, requestStreamable) {
    const [ responseHead, responseStreamable ] = await GETHandler(
      requestHead, requestStreamable)

    closeStreamable(responseStreamable)
    return [responseHead, emptyStreamable()]
  }

export const addAuxMethodHandlers = methodIndex => {
  if(!methodIndex.has('HEAD') && methodIndex.has('GET')) {
    const GETHandler = methodIndex.get('GET')
    methodIndex = methodIndex.set('HEAD',
      HEADHandler(GETHandler))
  }

  if(!methodIndex.has('OPTIONS')) {
    methodIndex = methodIndex.set('OPTIONS',
      OPTIONSHandler([...methodIndex.keys()]))
  }

  return methodIndex
}
