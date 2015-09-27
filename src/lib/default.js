import { error } from 'quiver-util/error'
import { closeStreamable } from 'quiver-stream-util'
import { streamHandler } from 'quiver-component-basic/constructor'

export const defaultStreamHandler = streamHandler(
  (args, streamable) => {
    closeStreamable(streamable)
    throw error(404, 'not found')
  })
  .export()
