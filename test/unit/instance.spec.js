import instance from 'src/instance'

describe('Instance unit test', () => {
  // 应该是一个没有属性的对象
  it('Should be a no object attributes', () => {
    expect(instance).toEqual({})
  })
})
