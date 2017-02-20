import Ali from './instance'

export function isAndroid() {
  return (/android/i).test(Ali.ua);
}

export function isIOS() {
  return (/iphone|ipad/i).test(Ali.ua);
}

//return 1代表目标比当前版本小，-1相反，相同为0
export function compareVersion(targetVersion) {
  var alipayVersion = Ali.alipayVersion.split(".");
  targetVersion = targetVersion.split(".");

  for (var i = 0, n1, n2; i < alipayVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(alipayVersion[i], 10) || 0;

    if (n1 > n2) return -1;
    if (n1 < n2) return 1;
  }

  return 0;
}
