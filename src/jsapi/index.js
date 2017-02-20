import { isStr } from '../unit'

var promise = new Promise(resolve => {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve()
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve)
  }
})

export function coreMixin (Ali) {
  /**
   * 通用接口，调用方式等同AlipayJSBridge.call;
   * 无需考虑接口的执行上下文，必定调用成功
   * @memberOf Ali
   */
  Ali.call = function () {
    var args = [].slice.call(arguments)

    //强制转为 name + object + function 形式的入参
    var name = args[0],
        opt = args[1] || {}

    if (!isStr(name)) {
        console.error('apiName error：', name)
        return
    }

    return promise.then(() => {
      return new Promise((resolve, reject) => {
        window.AlipayJSBridge.call(name, opt, result => {
          !result.error ? resolve(result) : reject(result)
        })
      })
    })
  }
}
