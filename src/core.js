/* @Promise the core unit */
import { isString } from './util'

/**
 * 解决调用时序，优化任务队列
 * 统一使用异步调用的方式
 */
const readyPromise = new Promise(resolve => {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve()
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve)
  }
})

export function ready () {
  return readyPromise
}

/**
 * 通用接口，调用方式等同AlipayJSBridge.call;
 * 无需考虑接口的执行上下文，必定调用成功
 */
export function call () {
  var args = Array.from(arguments)

  var name = args[0]
  var opt = args[1] || {}

  if (!isString(name)) {
    console.error('apiName error：', name)
    return
  }

  return readyPromise.then(() => new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(name, opt, result => {
      !result.error ? resolve(result) : reject(result)
    })
  }))
}
