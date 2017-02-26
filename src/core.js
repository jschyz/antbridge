/**
 * 解决调用时序，优化任务队列
 * 统一使用异步调用的方式
 */
export const readyPromise = new Promise(resolve => {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve()
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve)
  }
})
