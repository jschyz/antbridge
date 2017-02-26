import { ready, call, on, off } from 'src/method'

describe('Core unit test', () => {
  // 利用 Event 触发 AlipayJSBridgeReady 回调
  // 由于使用的是Promise方案，readyPromise 值永不更改，测试代码分支会少一块
  //    antbridge 注入时机在 AlipayJSBridgeReady 之后的情况
  beforeAll(() => {
    let event = new Event('AlipayJSBridgeReady')
    document.dispatchEvent(event)
  })

  // 测试代码块 ready 函数
  it('should be true if the async call has completed', () => {
    return ready().then(event => {
      expect(true).toBe(event instanceof Event)
    })
  })

  // 测试代码块 call 函数
  // 参数 apiName 不是字符串时
  it('should be parameter is not String', () => {
    return call().catch(result => {
      expect(result).toEqual({
        error: 1,
        errorMessage: '接口不存在'
      })
    })
  })

  // 正确调用 api 时，Promise 状态为 Fulfilled 情况
  describe('The success callback to be obtained', () => {
    let message = {
      error: undefined
    }

    beforeEach(() => {
      window.AlipayJSBridge = {
        call (name, opt, fn) {
          fn(message)
        }
      }
    })

    it('should be  mock the built-in parameters', () => {
      return call('api', {}).then(result => {
        expect(result).toEqual(message)
      })
    })
  })

  // 正确调用 api 时，Promise 状态为 Rejected 情况
  describe('The callback failed', () => {
    let message = {
      error: 1
    }

    beforeEach(() => {
      window.AlipayJSBridge = {
        call (name, opt, fn) {
          fn(message)
        }
      }
    })

    it('should be  mock the built-in parameters', () => {
      return call('api', {}).catch(result => {
        expect(result).toEqual(message)
      })
    })
  })

  // 单测：事件绑定 on off 实现
  describe('The event binding: on & off', () => {
    it('The binding event:using on', () => {
      on('titleClick', () => {
        console.log('title clicked')
      })
    })

    it('Remove event:using off', () => {
      off('titleClick')
      off('subtitleClick')
    })
  })
})
