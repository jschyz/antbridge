/*!
 * antbridge.js v1.1.4-rc
 * (c) 2017-2017 huihui
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ant = factory());
}(this, (function () { 'use strict';

var ant$1 = Object.create({});

/**
 * @name ua
 * @description 同集团统一UA规范
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
var ua = navigator.userAgent;

// antBridge版本号
var version = '1.1.4-rc';

/**
 * @name isAlipay
 * @description 是否在支付宝钱包内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
var isAlipay = ua.indexOf('AlipayClient') > -1 || ua.indexOf('AliApp(AP') > -1;

/**
 * @name isNebula
 * @description 是否在 Nebula 容器内运行
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
var isNebula = ua.indexOf('Nebula') > -1;

/**
 * @name alipayVersion
 * @description 支付宝钱包版本号
 * @memberOf Ali
 * @readonly
 * @type {string}
 */
var alipayVersion = (function () {
  if (isAlipay) {
    var version = ua.match(/AlipayClient\/(.*)/);
    return (version && version.length) ? version[1] : ''
  }
  return ''
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
var appinfo = {
  engine: 'alipay',
  engineVer: alipayVersion,
  name: 'alipay',
  ver: alipayVersion
};

var isAndroid = /android/i.test(ua);

var isIOS = /iphone|ipad/i.test(ua);

// return 1代表目标比当前版本小，-1相反，相同为0
function compareVersion (targetVersion) {
  targetVersion = targetVersion.split('.');
  var alipayVersion = alipayVersion.split('.');

  for (var i = 0, n1, n2; i < alipayVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(alipayVersion[i], 10) || 0;

    if (n1 > n2) { return -1 }
    if (n1 < n2) { return 1 }
  }

  return 0
}


var detect = Object.freeze({
	ua: ua,
	version: version,
	isAlipay: isAlipay,
	isNebula: isNebula,
	alipayVersion: alipayVersion,
	appinfo: appinfo,
	isAndroid: isAndroid,
	isIOS: isIOS,
	compareVersion: compareVersion
});

var toString = Object.prototype.toString;

// some isType methods: isFunction, isString, isNumber


function isString (obj) {
  return toString.call(obj) === '[object String]'
}

function isNumber (obj) {
  return toString.call(obj) === '[object Number]'
}

/* @Promise the core unit */
/**
 * 解决调用时序，优化任务队列
 * 统一使用异步调用的方式
 */
var readyPromise = new Promise(function (resolve) {
  if (window.AlipayJSBridge && window.AlipayJSBridge.call) {
    resolve();
  } else {
    document.addEventListener('AlipayJSBridgeReady', resolve);
  }
});

function ready () {
  return readyPromise
}

/**
 * 通用接口，调用方式等同AlipayJSBridge.call;
 * 无需考虑接口的执行上下文，必定调用成功
 */
function call () {
  var args = Array.from(arguments);

  var name = args[0];
  var opt = args[1] || {};

  if (!isString(name)) {
    console.error('apiName error：', name);
    return
  }

  return readyPromise.then(function () { return new Promise(function (resolve, reject) {
    window.AlipayJSBridge.call(name, opt, function (result) {
      !result.error ? resolve(result) : reject(result);
    });
  }); })
}


var core = Object.freeze({
	ready: ready,
	call: call
});

/**
 * 开新窗口
 * @param {string|object} opt 调用参数，可为对象或字符串
 * @param {string} opt.url 要打开的url
 * @param {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.pushWindow({
 *     url: "http://www.alipay.com"
 * }).then(function() {
 *     alert("end pushWindow");
 * });
 */
function pushWindow (opt, fn) {
  if (isString(opt)) {
    opt = {
      url: opt
    };
  }

  opt = opt || {};
  if (!opt.url) {
    console.error('Ali.pushWindow: url is required！');
    return false
  }

  return call('pushWindow', opt)
}

/**
 * 关闭窗口
 * @param {object} opt 调用参数
 * @param {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.popWindow().then(function() {
 *     alert("end popWindow");
 * });
 */
function popWindow (opt, fn) {
  return call('popWindow', opt)
}

/**
 * 退回指定界面
 * @param {number|object} opt 调用参数，可为对象或数字
 * @param {number} opt.step 往前或往后移动的步数
 * @param {function} fn 回调函数
 * @param {number} fn.errorCode 错误码
 * @param {string} fn.errorMessage 错误信息
 * @memberOf Ali
 * @todo 参数差别较大
 * @example
 * Ali.popTo({
 *     step: -1
 * }).then(function() {
 *     alert("end popTo");
 * });
 */
function popTo (opt, fn) {
  if (isNumber(opt)) {
    opt = {
      step: opt
    };
  } else if (isString(opt)) {
    opt = {
      urlPattern: opt
    };
  }
  opt.step !== undefined && (opt.index = opt.step);
  return call('popTo', opt)
}

var calendar = {
  /**
   * 添加日历事件
   * 备注：frequency 和 recurrenceTimes 若有值，则都必须有值
   * @alias calendar.add
   * @param {object} opt 调用参数
   * @param {string} opt.title 日历标题，必选
   * @param {string} opt.location 事件发生地点，可选
   * @param {string} opt.startDate 开始时间，必选
   * @param {string} opt.endDate 结束时间，必选
   * @param {int} opt.alarmOffset 事件开始前多少分钟提醒，可选，默认值为 15
   * @param {int} opt.recurrenceTimes 循环发生次数，可选，默认值为 0（不循环）
   * @param {string} opt.frequency 循环频率(year/month/week/day)，可选，默认不循环
   * @param {string} opt.notes 事件内容，可选
   * @param {function} fn 回调函数
   * @param {number} fn.errorCode 错误码
   * @param {string} fn.errorMessage 错误信息
   * @memberOf Ali
   * @example
   * Ali.calendar.add({
   *      title: "日历测试",
   *      startDate: "2014-07-09 14:20:00",
   *      endDate: "2014-07-09 14:40:00",
   *      location: "黄龙时代广场",
   *      notes: "日历事件内容日历事件内容日历事件内容",
   *      alarmOffset: 10,
   *      recurrenceTimes: 2,
   *      frequency: "day"
   * }).then(function(result) {
   *     alert(JSON.stringify(result));
   * });
   */
  add: function (opt) {
    return call('addEventCal', opt)
  }
};

/**
 * 拍照/选择照片
 * @param {object} opt 调用参数，为对象
 * @param {string} opt.dataType 结果数据格式：dataurl|fileurl|remoteurl
 * @param {string} opt.cameraType 指定是前置摄像头还是后置摄像头，front(前置)，back(后置)
 * @param {boolean} opt.allowedEdit 是否允许编辑(框选). 为true时，拍照时会有一个方形的选框
 * @param {string} opt.src 图片来源：gallary|camera
 * @param {string} opt.maskImg 遮罩图片地址
 * @param {string} opt.maskWidth 遮罩宽度
 * @param {string} opt.maskHeight 遮罩高度
 * @param {number} opt.maxWidth 图片的最大宽度. 过大将被等比缩小
 * @param {number} opt.maxHeight 图片的最大高度. 过大将被等比缩小
 * @param {string} opt.format jpg|png
 * @param {number} opt.quality 图片质量, 取值1到100
 * @param {function} fn 回调函数
 * @param {number} fn.errorCode 错误码
 * @param {string} fn.errorMessage 错误信息
 * @param {string} fn.photo 照片信息，为 dataUrl 或者 fileUrl
 * @memberOf Ali
 * @todo 暂不支持 src, cameraType, maskImg, maskWidth, maskHeight
 * @todo dataType 不支持 remoteurl
 * @example
 * Ali.photo({
 *     dataType: "dataurl",
 *     allowedEdit: true,
 *     src: "camera",
 *     format: "jpg",
 *     quality: 100
 * }).then(function() {
 *     alert("end photo");
 * });
 */
function photo (opt) {
  opt = opt || {};

  var def = {
    format: 'jpg',
    dataType: 'dataurl',
    quality: 50,
    allowEdit: false,
    src: undefined,
    cameraType: undefined,
    maskImg: undefined,
    maskWidth: undefined,
    maskHeight: undefined
  };

  Object.assign(def, opt);

  def.imageFormat = def.format;

  if (def.dataType === 'remoteurl') {
    def.dataType = 'dataurl';
  }

  def.dataType = def.dataType.slice(0, -3) + def.dataType.slice(-3).toUpperCase();

  return call('photo', def).then(function (result) {
    if (result.dataURL) {
      result.dataURL = 'data:image/' + def.imageFormat + ';base64,' + result.dataURL;
    }

    result.photo = result.dataURL || result.fileURL;

    return result
  }, function (result) {
    result.errorMessage = result.error === 10 ? '用户取消' : result.errorMessage;
    return result
  })
}

var vibration = {
  /**
   * 调用震动
   * @alias vibration.vibrate
   * @param {number|object} opt 调用参数，可为对象或数字
   * @param {number} opt.duration 震动时间
   * @param {function} fn 回调函数
   * @todo 暂时不支持 opt
   * @memberOf Ali
   * @example
   * Ali.vibration.vibrate({
   *     duration: 3000
   * }).then(function() {
   *     alert("end vibrate");
   * });
   */
  vibrate: function (opt) {
    if (isNumber(opt)) {
      opt = {
        duration: opt
      };
    }
    return call('vibrate', opt)
  }
};

var shake = {
  /**
   * 摇一摇
   * @alias shake.watch
   * @param {object} opt 调用参数，可为对象或字符串
   * @param {function} opt.onShake
   * @param {function} fn 回调函数
   * @param {number} fn.errorCode 错误码
   * @param {string} fn.errorMessage 错误信息
   * @memberOf Ali
   * @todo 暂时不支持 opt 参数
   * @example
   * Ali.shake.watch({
   *     onShake: function() {
   *         alert("onShake");
   *     }
   * }).then(function() {
   *     alert("end shake");
   * })
   */
  watch: function (opt) {
    return call('watchShake', opt)
  }
};

var geolocation = {
  /**
   * 获取位置信息
   * @alias geolocation.getCurrentPosition
   * @param {object} opt 调用参数，可选
   * @param {number} opt.timeout 超时返回时间，单位ms，默认为 15000ms
   * @param {function} fn 回调函数
   * @param {double} fn.coords.latitude 纬度
   * @param {double} fn.coords.longitude 经度
   * @param {string} fn.city 城市
   * @param {string} fn.province 省份
   * @param {string} fn.cityCode 城市编码
   * @param {array} fn.address 地址
   * @param {number} fn.errorCode 错误码
   * @param {string} fn.errorMessage 错误信息
   * @memberOf Ali
   * @example
   * Ali.geolocation.getCurrentPosition().then(function(result) {
   *     alert(JSON.stringify(result));
   * });
   */
  //  getCurrentPosition: function (opt) {
  //    if (fn === undefined && isFn(opt)) {
  //      fn = opt
  //      opt = null
  //    }
  //    opt = opt || {
  //      timeout: 15000
  //    }
   //
  //    var timer = setTimeout(function() {
  //      timer = null;
  //      console.error("geolocation.getCurrentPosition: timeout");
   //
  //      var result = {
  //        errorCode: 5,
  //        errorMessage: "调用超时"
  //      };
   //
  //      fn && fn(result);
  //     }, opt.timeout);
   //
  //      Ali.call("getLocation", function(result) {
  //        if (timer) {
  //            clearTimeout(timer);
   //
  //            result.coords = {};
  //            result.coords.latitude = +result.latitude;
  //            result.coords.longitude = +result.longitude;
   //
  //            result.city = result.city ? result.city : result.province;
  //            result.cityCode = result.citycode;
   //
  //            result.address = result.pois;
   //
  //            fn && fn(result);
  //        }
  //    })
  //  }
};

/**
 * 调用native的分享接口，H5情况下请自行调用mui的分享组件
 *
 * @name share
 * @memberOf Ali
 * @function
 *
 * @param {Object} opt 分享参数，可以使用原生的 { channels: [] } 格式
 * @param {string} opt.title 分享标题
 * @param {string} opt.text 分享内容
 * @param {string} opt.image 需要分享的图片地址
 * @param {string} opt.url 需要分享的URL
 * @param {boolean} [opt.captureScreen=false] 分享当前屏幕截图，无image时有效(只有支付宝支持)
 * @param {number} [opt.shareType=-1] 分享渠道，多渠道可以复合使用(a|b|c，支付宝)，推荐使用-1，淘客不支持
 * <br><br>
 * <ul>
 *    <li>-1: 用户选择</li>
 *    <li>1: 微信好友</li>
 *    <li>2: 微博</li>
 *    <li>4: 短信(支付宝)</li>
 *    <li>8: 来往好友</li>
 *    <li>16: 来往动态</li>
 *    <li>32: 微信朋友圈</li>
 *    <li>64: 复制链接(支付宝)</li>
 * </ul>
 * @param {Function} callback 分享调用的回调
 *
 * @example
 * Ali.share({
 *     shareType: -1,
 *     title: '憨豆',
 *     text: '～憨豆～哈哈哈哈～',
 *     image: 'http://mingxing.wubaiyi.com/uploads/allimg/c110818/1313A1952W0-15029.jpg',
 *     url: 'http://mingxing.wubaiyi.com/uploads/allimg/c110818/1313A1952W0-15029.jpg'
 * }).then(function (result) {
 *     if (result.errorCode) {
 *         // 调用分享出错，这个时候可以调用mui的分享或者提示出错
 *     }
 * });
 */
function share (opt) {
  var shareTypes = {
    1: 'Weixin',
    2: 'Weibo',
    4: 'SMS',
    8: 'LaiwangContacts',
    16: 'LaiwangTimeline',
    32: 'WeixinTimeLine',
    64: 'CopyLink'
  };
  opt = opt || {};
  var data = opt;
  // 如果有 channels 参数就认为是原始的参数格式，否则认为是统一的参数格式
  if (!opt.channels || opt.channels.length === 0) {
    opt.title = opt.title || '';
    opt.content = opt.text;
    opt.imageUrl = opt.image;
    opt.captureScreen = !!opt.captureScreen;
    opt.url = opt.url || '';

    data = {
      channels: []
    };
    if (typeof opt.shareType === 'undefined') {
      opt.shareType = -1;
    }
    for (var i in shareTypes) {
      if (Number(i) & opt.shareType) {
        data.channels.push({
          name: shareTypes[i],
          param: opt
        });
      }
    }
  } else if (isAndroid) {
    // hack android QZoneChannel to QQZoneChannel
    opt.channels.forEach(function (channel) {
      if (channel.name.toLowerCase() === 'qzone') {
        channel.name = 'QQZone';
      }
    });
  }
  return call('share', data)
}

var contacts = {
  /**
   * 调用本地通讯录
   * @alias contacts.get
   * @param {object} opt 调用参数，为对象，可选
   * @param {boolean} opt.multiple 是否多选，默认为 false
   * @param {function} fn 回调函数
   * @param {array} fn.results 联系人数组
   * @param {string} fn.results[i].name 联系人姓名
   * @param {string} fn.results[i].phoneNumber 联系人号码
   * @param {string} fn.results[i].email 联系人 email
   * @param {number} fn.errorCode 错误码
   * @param {string} fn.errorMessage 错误信息
   * @memberOf Ali
   * @todo 暂时不支持 email
   * @todo 暂时不支持 multiple
   * @example
   * Ali.contacts.get().then(function(result) {
   *     alert(JSON.stringify(result));
   * });
   */
  get: function (opt, fn) {
    opt = opt || {};
    opt.multiple && console.error('仅支持单选');

    return call('contact', opt).then(function (result) {
      result.results = [];

      result.results[0] = {
        phoneNumber: result.mobile,
        email: undefined,
        name: result.name
      };

      return result
    }, function (result) {
      switch (result.errorCode) {
        case 10:
          result.errorMessage = '没有权限';
          break

        case 11:
          result.errorMessage = '用户取消操作';
          break
      }

      return result
    })
  }
};

var network = {
  /**
   * 获取网络状态
   * @alias network.getType
   * @param {object} opt 调用参数，可选
   * @param {number} opt.timeout 超时返回时间，单位ms，默认为 15000ms
   * @param {function} fn 回调函数
   * @param {object} fn.result 包含各种网络状况的对象
   * @param {boolean} fn.result.is3G 是否在使用3G网络
   * @param {boolean} fn.result.is2G 是否在使用2G网络
   * @param {boolean} fn.result.isWifi 是否在使用 Wifi
   * @param {boolean} fn.result.isE 是否处于 E
   * @param {boolean} fn.result.isG 是否处于 G
   * @param {boolean} fn.result.isH 是否处于 H
   * @param {boolean} fn.result.isOnline 是否联网
   * @param {string} fn.result.type 网络类型
   * @param {boolean} fn.networkAvailable 网络是否连网可用
   * @param {number} fn.errorCode 错误码
   * @param {string} fn.errorMessage 错误信息
   * @memberOf Ali
   * @todo 目前仅支持判断是否 wifi 连接以及是否联网
   * @example
   * Ali.network.getType().then(function(result, networkAvailable) {
   *     alert(JSON.stringify(result));
   * });
   */
  getType: function (opt) {
    opt = opt || {
      timeout: 15000
    };

    // Promise 处理超时
    return Promise.race([
      call('getNetworkType').then(function (result) {
        result.networkAvailable = result.networkType !== 'fail';
        result.is3G = result.is2G = result.isE = result.isG = result.isH = false;
        result.isWifi = result.networkType === 'wifi';
        result.isOnline = result.networkAvailable;
        result.type = result.networkType;

        return result
      }),
      new Promise(function (resolve, reject) {
        setTimeout(function () {
          console.error('network.getType: timeout');
          reject({
            errorCode: 5,
            errorMessage: '调用超时'
          });
        }, opt.timeout);
      })
    ])
  }
};

/**
 * 唤起钱包登录功能；
 * 调用login可以延续钱包的登录session, 一般会有免登，不会弹出钱包登录界面
 * @param {function} fn 回调函数；回调函数执行时，一定是登录已经成功
 * @param {number} fn.errorCode 错误码
 * @param {string} fn.errorMessage 错误信息
 * @memberOf Ali
 * @example
 * Ali.login().then(function() {
 *     alert("end login");
 * });
 */
function login () {
  return call('login')
}

/**
 * 快捷支付native接口，在支付宝和接入支付宝快捷支付SDK的应用中有效
 * @param {string|object} opt 调用参数，可为对象或字符串
 * @param {string} opt.tradeNO 交易号。多个用";"分隔
 * @param {string} opt.partnerID 商户id
 * @param {string} opt.bizType 交易类型，默认为 trade
 * @param {string} opt.bizSubType 交易子类型
 * @param {bool} opt.displayPayResult 是否显示支付结果页，默认为 true
 * @param {string} opt.bizContext 支付额外的参数，格式为JSON字符串
 * @param {string} opt.orderStr 完整的一个支付字符串
 * @param {function} fn 回调函数
 * @param {number} fn.errorCode 错误码
 * @param {string} fn.errorMessage 错误信息
 * @memberOf Ali
 * @example
 * Ali.tradePay({
 *     tradeNO: "201209071234123221"
 * }).then(function() {
 *     alert("end tradePay");
 * });
 */
function tradePay (opt, fn) {
  return call('tradePay', opt)
}

/**
 * h5支付接口，弹出H5页面让用户支付
 * <br>支付宝不支持此接口，支付宝请使用 Ali.tradePay
 * @param {object} opt 调用参数
 * @param {string} opt.signStr 服务端生成的加签支付字符串
 * @param {string} opt.alipayURL wap支付的地址,当极简支付无法支持的时候或者用户设置了不用新版支付，都会采用wap支付
 * @param {string} [opt.backURL] 表示成功后的跳转
 * @param {string} opt.unSuccessUrl 表示不成功后的跳转(可能失败，也有可能用户取消等等)后的url，
 *     这个url我们会在调用前加入支付宝返回的结果，格式如下<br>
 *     {
 *         "result" : "",
 *         "memo" : "用户中途取消",
 *         "ResultStatus" : "6001"
 *     }
 * @param {function} fn 回调函数
 * @memberOf Ali
 */
function h5TradePay (opt) {
  console.error('alpayClient don\'t support Ali.h5TradePay，please use Ali.tradePay');

  return ready().then(function () { return ({
    errorCode: 1,
    errorMessage: '接口不存在'
  }); })
}

// ------------------
// 以下接口暂时不支持

/**
 Ali.motion = {};
 Ali.audio = {};
 Ali.orientation = {};

 Ali.network.watch = Ali.network.clearWatch = Ali.motion.watch = Ali.motion.clearWatch =
 Ali.audio.play = Ali.audio.stop = Ali.orientation.watch = Ali.orientation.clearWatch =
 Ali.geolocation.clearWatch = Ali.network.watch = Ali.network.clearWatch = function() {
 if (arguments.length > 0 && typeof arguments[arguments.length - 1] === "function") {
 var result = {
 errorCode: 3,
 errorMessage: "未知错误"
 };

 arguments[arguments.length - 1](result);
 }
 };
 */

// ------------------
// 仅供支付宝钱包使用

function alert (opt) {
  if (isString(opt) || isNumber(opt)) {
    opt = {
      message: opt + ''
    };
  }
  return call('alert', opt)
}

function confirm (opt) {
  if (isString(opt) || isNumber(opt)) {
    opt = {
      message: opt + ''
    };
  }
  return call('confirm', opt)
}

function actionSheet (opt, fn) {
  // Android上整个标题栏都不显示，界面不好看
  if (isAndroid) {
    if (typeof opt.title === 'undefined' || opt.title === '') {
      opt.title = ' ';
    }
  }
  return call('actionSheet', opt)
}

function openInBrowser (opt, fn) {
  if (isString(opt)) {
    opt = {
      url: opt
    };
  }
  return call('openInBrowser', opt)
}

/**
 * 弱提示
 * @param {(string|object)} opt 调用参数，可为对象或字符串（为显示内容）
 * @param {string} opt.text 文字内容
 * @param {string} opt.type  icon类型，分为 none / success / fail；默认为 none；暂时不支持该参数
 * @param {number} opt.duration 显示时长，单位为毫秒，默认为 2000；暂时不支持该参数
 * @memberOf Ali
 * @example // 调用参数为对象
 * Ali.toast({
 *   text: "test toast",
 *   type: "success"
 * }).then(function() {
 *   alert("end toast");
 * });
 * @example // 调用参数为字符串
 * Ali.toast("test toast").then(function() {
 *   alert("end toast");
 * });
 */
function toast (opt) {
  if (isString(opt) || isNumber(opt)) {
    opt = {
      text: opt + ''
    };
  }

  opt = opt || {};
  opt.content = opt.text;
  opt.duration = opt.duration || 2000;

  // todo android hack，为了解决android不是在消失后才回调的问题。
  return call('toast', opt)
}

/**
 * 设置标题
 * @param {string|object} opt 调用参数，可为对象或字符串
 * @param {string} opt.text 文案
 * @param {string} opt.type title|subtitle
 * @param {string} opt.subtitle 副标题（仅在支付宝使用）
 * @param {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.setTitle({
 *     text: "title",
 *     type: "title"
 * }).then(function() {
 *     alert("end setTitle");
 * });
 */
function setTitle (opt) {
  var def = {
    type: 'title'
  };

  if (isString(opt)) {
    opt = {
      title: opt
    };
  }

  opt.title = opt.title || opt.text;

  Object.assign(def, opt);

  if (def.title === null) {
    console.error('setTitle: title is required！');
    return false
  }

  return call('setTitle', def)
}

/**
 * 显示标题栏
 * @param {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.showTitle().then(function() {
 *     alert("end showTitle");
 * });
 */
function showTitle () {
  return call('showTitlebar')
}

/**
 * 隐藏标题栏
 * @param  {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.hideTitle().then(function() {
 *     alert("end hideTitle");
 * });
 */
function hideTitle () {
  return call('hideTitlebar')
}

/**
 * 显示loading
 * @param {string|object} opt 调用参数，可为对象或字符串
 * @param {string} opt.text 文本内容；若不指定，则显示为中间大菊花；如果指定，显示为小菊花右侧带文字
 * @param {function} fn 回调函数
 * @memberOf Ali
 * @example
 * Ali.showLoading({
 *     text: "loading"
 * }).then(function() {
 *     alert("end showLoading");
 * });
 */
// export function showLoading (opt, fn) {
//   if (isStr(opt) || isNumber(opt)) {
//     opt = {
//       text: opt + ""
//     };
//   }
//   opt = opt || {};
//   // 修复opt.delay传入0时会使用默认值1000的bug
//   var delay = isNumber(opt.delay) ? opt.delay : 1000;
//   delete opt.delay;
//   // 修复ios delay导致的hideLoading不一定能成功阻止被delay的showLoading的bug
//   if (delay > 0 && isIOS()) {
//     var st = setTimeout(function() {
//       Ali.call('showLoading', opt, fn);
//     }, delay);
//     Ali._stLoadingQueue = Ali._stLoadingQueue || [];
//     Ali._stLoadingQueue.push(st);
//     return st;
//   }
//   Ali.call("showLoading", opt, fn);
// }

/**
* 隐藏loading
* @param {function} fn 回调函数
* @memberOf Ali
* @example
* Ali.hideLoading().then(function() {
*     alert("end hideLoading");
* });
*/
// Ali.hideLoading = function(fn) {
//   if ('array' === type(Ali._stLoadingQueue)) {
//     if (Ali._stLoadingQueue.length) {
//       antLog('clearLoadingCount: ' + Ali._stLoadingQueue.length);
//       while (Ali._stLoadingQueue.length) {
//         clearTimeout(Ali._stLoadingQueue.shift());
//       }
//     }
//   }
//   return call('hideLoading', fn);
// }


var api = Object.freeze({
	pushWindow: pushWindow,
	popWindow: popWindow,
	popTo: popTo,
	calendar: calendar,
	photo: photo,
	vibration: vibration,
	shake: shake,
	geolocation: geolocation,
	share: share,
	contacts: contacts,
	network: network,
	login: login,
	tradePay: tradePay,
	h5TradePay: h5TradePay,
	alert: alert,
	confirm: confirm,
	actionSheet: actionSheet,
	openInBrowser: openInBrowser,
	toast: toast,
	setTitle: setTitle,
	showTitle: showTitle,
	hideTitle: hideTitle
});

Object.assign(ant$1, detect);
Object.assign(ant$1, core);
Object.assign(ant$1, api);

['startApp', 'showOptionMenu', 'hideOptionMenu', 'showToolbar', 'hideToolbar', 'closeWebview', 'sendSMS', 'scan', 'getSessionData', 'setSessionData', 'checkJSAPI', 'checkApp', 'isInstalledApp', 'deposit', 'chooseContact', 'alipayContact', 'getConfig', 'getCities', 'rsa', 'getWifiList', 'connectWifi', 'notifyWifiShared', 'thirdPartyAuth', 'getThirdPartyAuthcode', 'setToolbarMenu', 'exitApp', 'hideBackButton', 'startApp', 'startPackage', 'getSharedData', 'setSharedData', 'removeSharedData', 'setClipboard', 'startDownload', 'stopDownload', 'getDownloadInfo', 'detectBeacons', 'startBeaconsBeep', 'stopBeaconsBeep', 'startIndoorLocation', 'stopIndoorLocation', 'addEventCal', 'startSpeech', 'stopSpeech', 'cancelSpeech', 'getWifiInfo', 'clearAllCookie', 'getMtopToken', 'getClientInfo', 'sinasso', 'getClipboard', 'checkBLEAvalability', 'scanBeacons', 'isSpeechAvailable', 'speechRecognizer', 'contactSync', 'setGestureBack', 'remoteLog', 'httpRequest', 'rpc', 'ping', 'snapshot', 'imageViewer', 'upload', 'networkAnalysis', 'showTitleLoading', 'hideTitleLoading', 'getLocation'].forEach(function (methodName) {
  ant$1[methodName] = function () {
    var args = Array.from(arguments);

    ant$1.call.apply(null, [methodName].concat(args));
  };
});

return ant$1;

})));
