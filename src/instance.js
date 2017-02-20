var Ali = {};

/**
 * @name ua
 * @description 同集团统一UA规范
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali.ua = navigator.userAgent;

//antBridge版本号
Ali.version = "1.1.4";

/**
 * @name isAlipay
 * @description 是否在支付宝钱包内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali.isAlipay = (function() {
  return (Ali.ua.indexOf("AlipayClient") > -1 || Ali.ua.indexOf("AliApp(AP") > -1);
})();

/**
 * @name isNebula
 * @description 是否在 Nebula 容器内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali.isNebula = (function() {
  return (Ali.ua.indexOf("Nebula") > -1);
})();

// 不是支付宝的话打印出报错信息
if (!Ali.isNebula) {
  console.warn('Run antBridge.js in Nebula please!');
}

/**
 * @name alipayVersion
 * @description 支付宝钱包版本号
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali.alipayVersion = (function() {
  if (Ali.isAlipay) {
    var version = Ali.ua.match(/AlipayClient\/(.*)/);
    return (version && version.length) ? version[1] : "";
  }
  return "";
})();

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
Ali.appinfo = {
  engine: "alipay",
  engineVer: Ali.alipayVersion,
  name: "alipay",
  ver: Ali.alipayVersion
};

export default Ali
