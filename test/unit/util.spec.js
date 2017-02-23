import { isFunction, isString, isNumber } from 'src/util'

describe('Util', () => {
  it('is Function', () => {
    expect(true).toBe(isFunction(function () {}))
    expect(true).toBe(isFunction(() => {}))
    expect(false).toBe(isFunction({}))
  })

  it('is String', () => {
    expect(true).toBe(isString(''))
    expect(true).toBe(isString(``))
    expect(false).toBe(isString(null))
  })

  it('is Number', () => {
    expect(true).toBe(isNumber(0))
    expect(true).toBe(isNumber(0e0))
    expect(true).toBe(isNumber(Infinity))
  })
})
