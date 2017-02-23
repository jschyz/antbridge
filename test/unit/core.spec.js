import { ready, call, on, off } from 'src/core'

describe('Core unit test', () => {
  beforeEach(() => {
    var event = new Event('AlipayJSBridgeReady')
    document.dispatchEvent(event)
  })

  it('should use `done` for test?', () => {
    return ready().then(event => {
      expect(true).toBe(event instanceof Event)
    })
  })
})
