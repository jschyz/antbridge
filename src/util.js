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

export function extend (to, _from) {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
