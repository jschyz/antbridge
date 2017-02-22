import { isFunction } from 'src/util'

describe('Util', () => {

  it("Is Function", function() {
		expect(true).toEqual(isFunction(function(){}));
    expect(false).toEqual(isFunction({}));
	})

})
