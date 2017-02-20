/*!
 * antbridge.js v1.1.4-rc
 * (c) 2017-2017 huihui
 * Released under the MIT License.
 */
'use strict';

var Ali$1 = {};

/**
 * @name ua
 * @description 同集团统一UA规范
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali$1.ua = navigator.userAgent;

//antBridge版本号
Ali$1.version = "1.1.4";

/**
 * @name isAlipay
 * @description 是否在支付宝钱包内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali$1.isAlipay = (function() {
  return (Ali$1.ua.indexOf("AlipayClient") > -1 || Ali$1.ua.indexOf("AliApp(AP") > -1);
})();

/**
 * @name isNebula
 * @description 是否在 Nebula 容器内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali$1.isNebula = (function() {
  return (Ali$1.ua.indexOf("Nebula") > -1);
})();

// 不是支付宝的话打印出报错信息
if (!Ali$1.isNebula) {
  console.warn('Run antBridge.js in Nebula please!');
}

/**
 * @name alipayVersion
 * @description 支付宝钱包版本号
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
Ali$1.alipayVersion = (function() {
  if (Ali$1.isAlipay) {
    var version = Ali$1.ua.match(/AlipayClient\/(.*)/);
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
Ali$1.appinfo = {
  engine: "alipay",
  engineVer: Ali$1.alipayVersion,
  name: "alipay",
  ver: Ali$1.alipayVersion
};

function isStr(str) {
  return 'string' === type(str);
}





function type(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object (\w+)\]/, '$1').toLowerCase();
}

var promise = new Promise(function (resolve) {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve();
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve);
  }
});

function coreMixin (Ali) {
  /**
   * 通用接口，调用方式等同AlipayJSBridge.call;
   * 无需考虑接口的执行上下文，必定调用成功
   * @memberOf Ali
   */
  Ali.call = function () {
    var args = [].slice.call(arguments);

    //强制转为 name + object + function 形式的入参
    var name = args[0],
        opt = args[1] || {};

    if (!isStr(name)) {
        console.error('apiName error：', name);
        return
    }

    return promise.then(function () {
      return new Promise(function (resolve, reject) {
        window.AlipayJSBridge.call(name, opt, function (result) {
          !result.error ? resolve(result) : reject(result);
        });
      })
    })
  };
}

/* @flow */
coreMixin(Ali$1);

module.exports = Ali$1;
