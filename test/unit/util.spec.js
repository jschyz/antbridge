import { isFunction, isString, isNumber, extend } from 'src/util'

describe('Util', () => {
  it('Should be a Function', () => {
    expect(true).toBe(isFunction(function () {}))
    expect(true).toBe(isFunction(() => {}))
    expect(false).toBe(isFunction({}))
  })

  it('Should be a String', () => {
    expect(true).toBe(isString(''))
    expect(true).toBe(isString(``))
    expect(false).toBe(isString(null))
  })

  it('Should be a Number', () => {
    expect(true).toBe(isNumber(0))
    expect(true).toBe(isNumber(0e0))
    expect(true).toBe(isNumber(Infinity))
  })

  it('extend:Object.assign', () => {
    expect({o: 'object'}).toEqual(extend({}, {o: 'object'}))
    expect({o: 'object'}).toEqual(extend({}, Object.freeze({o: 'object'})))
  })
})
