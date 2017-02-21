var toString = Object.prototype.toString

// some isType methods: isFunction, isString, isNumber
export function isFunction (obj) {
  return toString.call(obj) === '[object Function]'
}

export function isString (obj) {
  return toString.call(obj) === '[object String]'
}

export function isNumber (obj) {
  return toString.call(obj) === '[object Number]'
}
