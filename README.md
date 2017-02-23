# antbridge

<p align="center">
  <a href="https://circleci.com/gh/jschyz/antbridge/tree/master"><img src="https://img.shields.io/circleci/project/jschyz/antbridge/master.svg" alt="Build Status"></a>
</p>

- 解决调用时序，优化任务队列
- 统一使用异步调用的方式
- 对一些有可能超时 api (network\geolocation) 使用 Promise.race 来处理超时方案
- 编写多任务流时，代码清晰更可控

### 使用
```
ant.call('api', opts).then(result => console.log(result))
```

### 实现核心

利用 Promise 保证每次调用都是已异步方式进行，让开发者不必关心 `AlipayJSBridge` 注入时机问题，也不需要关心任务被漏掉等情况

```
const readyPromise = new Promise(resolve => {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve()
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve)
  }
})
```

### 关于 Unit Test

方案使用: karma + jasmine + phantomjs 全家桶对方式进行 Unit Test

由于 `jasmine` 断言环境，不是标准的 Nebula 容器。故测试时不会自动注入 AlipayJSBridge 对象，从而触发 AlipayJSBridgeReady 事件（细节是在 DOMContentLoaded 之后触发）。

那么在运行 Spec 时，我们可以利用 DOM Event(自定义事件) 来初始化

``` javascript
beforeEach(() => {
  var event = new Event('AlipayJSBridgeReady')
  document.dispatchEvent(event)
})
```

### todo
