export function isFn(fn) {
  return 'function' === type(fn);
}

export function isStr(str) {
  return 'string' === type(str);
}

export function isObj(o) {
  return 'object' === type(o);
}

export function isNumber(num) {
  return "number" === type(num);
}

export function type(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object (\w+)\]/, '$1').toLowerCase();
}

export function simpleExtend(target, source) {
  if (source) {
    for (var k in source) {
      target[k] = source[k];
    }
  }
  return target;
}
