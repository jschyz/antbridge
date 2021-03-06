import ant from './instance'
import * as detect from './detect'
import * as method from './method'
import * as api from './api'
import { extend } from './util'

extend(ant, detect)
extend(ant, method)
extend(ant, api);

['startApp', 'showOptionMenu', 'hideOptionMenu', 'showToolbar', 'hideToolbar', 'closeWebview', 'sendSMS', 'scan', 'getSessionData', 'setSessionData', 'checkJSAPI', 'checkApp', 'isInstalledApp', 'deposit', 'chooseContact', 'alipayContact', 'getConfig', 'getCities', 'rsa', 'getWifiList', 'connectWifi', 'notifyWifiShared', 'thirdPartyAuth', 'getThirdPartyAuthcode', 'setToolbarMenu', 'exitApp', 'hideBackButton', 'startApp', 'startPackage', 'getSharedData', 'setSharedData', 'removeSharedData', 'setClipboard', 'startDownload', 'stopDownload', 'getDownloadInfo', 'detectBeacons', 'startBeaconsBeep', 'stopBeaconsBeep', 'startIndoorLocation', 'stopIndoorLocation', 'addEventCal', 'startSpeech', 'stopSpeech', 'cancelSpeech', 'getWifiInfo', 'clearAllCookie', 'getMtopToken', 'getClientInfo', 'sinasso', 'getClipboard', 'checkBLEAvalability', 'scanBeacons', 'isSpeechAvailable', 'speechRecognizer', 'contactSync', 'setGestureBack', 'remoteLog', 'httpRequest', 'rpc', 'ping', 'snapshot', 'imageViewer', 'upload', 'networkAnalysis', 'showTitleLoading', 'hideTitleLoading', 'getLocation'].forEach(methodName => {
  ant[methodName] = function () {
    var args = Array.from(arguments)

    ant.call.apply(null, [methodName].concat(args))
  }
})

export default ant
