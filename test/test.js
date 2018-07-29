const td = require('testdouble')
const { expect } = require('chai')

const chain = require('../lib')

describe('td-chain', () => {
  it('works with just a function call', () => {
    const fn = td.function()
    
    td.when(chain(fn)(1)).thenReturn(2)

    expect(fn(1)).equals(2)
  })

  it('works with a chained function call', () => {
    const fn = td.function()
    
    td.when(
      chain(fn)(1).something(2)
    ).thenReturn(3)
    
    expect(
      fn(1).something(2)
    ).equals(3)
  })

  it('works with just chained function calls', () => {
    const fn = td.object(['something'])
    
    td.when(
      chain(fn).something(1).else(2)
    ).thenReturn(3)
    
    expect(
      fn.something(1).else(2)
    ).equals(3)
  })
})
