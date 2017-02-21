/**
 * @name ua
 * @description 同集团统一UA规范
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
export const ua = navigator.userAgent

// antBridge版本号
export const version = '__VERSION__'

/**
 * @name isAlipay
 * @description 是否在支付宝钱包内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
export const isAlipay = ua.indexOf('AlipayClient') > -1 || ua.indexOf('AliApp(AP') > -1

/**
 * @name isNebula
 * @description 是否在 Nebula 容器内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
export const isNebula = ua.indexOf('Nebula') > -1

/**
 * @name alipayVersion
 * @description 支付宝钱包版本号
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
export const alipayVersion = (function () {
  if (isAlipay) {
    var version = ua.match(/AlipayClient\/(.*)/)
    return (version && version.length) ? version[1] : ''
  }
  return ''
})()

/**
 * @name appinfo
 * @description 同集团统一的应用信息标识，用于判断应用及版本
 * @property {string} engine 应用所使用的 Hybrid 容器名
 * @property {string} engineVer 应用所使用的 Hybrid 容器版本号
 * @property {string} name 应用名
 * @property {string} ver 应用版本号
 * @memberOf Ali
 * @readonly
 * @type {Object}
 */
export const appinfo = {
  engine: 'alipay',
  engineVer: alipayVersion,
  name: 'alipay',
  ver: alipayVersion
}

export const isAndroid = /android/i.test(ua)

export const isIOS = /iphone|ipad/i.test(ua)

// return 1代表目标比当前版本小，-1相反，相同为0
export function compareVersion (targetVersion) {
  targetVersion = targetVersion.split('.')
  var alipayVersion = alipayVersion.split('.')

  for (var i = 0, n1, n2; i < alipayVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0
    n2 = parseInt(alipayVersion[i], 10) || 0

    if (n1 > n2) return -1
    if (n1 < n2) return 1
  }

  return 0
}
