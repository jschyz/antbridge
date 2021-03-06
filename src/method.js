/* @Promise the core unit */
import { isString } from './util'
import { readyPromise } from './core'

export function ready () {
  return readyPromise
}

/**
 * 通用接口，调用方式等同AlipayJSBridge.call;
 * 无需考虑接口的执行上下文，必定调用成功
 */
export function call () {
  var args = [].slice.call(arguments)

  var name = args[0]
  var opt = args[1] || {}

  if (!isString(name)) {
    return Promise.reject({
      error: 1,
      errorMessage: '接口不存在'
    })
  }

  return readyPromise.then(() => new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(name, opt, result => {
      !result.error ? resolve(result) : reject(result)
    })
  }))
}

export var _listener = {}
/**
 * 绑定全局事件
 * @param {string} event 事件名称，多个事件可用空格分隔开
 * @param {function} fn 回调函数
 * @memberOf Ali
 */
export function on (event, fn) {
  event.split(/\s+/g).forEach(eventName => {
    _listener[eventName] || (_listener[eventName] = [])
    _listener[eventName].push(fn)
    document.addEventListener(eventName, fn, false)
  })
}

/**
 * 移除事件监听
 * @method off
 * @param  {String}   evt    事件类型
 */
export function off (evt) {
  var fn
  _listener[evt] || (_listener[evt] = [])

  while ((fn = _listener[evt].shift()) !== undefined) {
    document.removeEventListener(evt, fn, false)
  }
}
