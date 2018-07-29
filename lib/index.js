const td = require('testdouble')

module.exports = function makeChain(double) {
  return typeof double === 'function'
    ? getInitialiser(double)
    : getMethodProxy(double)
}

function getInitialiser(double) {
  return (...initialArgs) => {
    // Invoke the TD. If something is chain of the return value of this function, this call will be
    // comsumed by the `td.when()` that sets this return value. If nothing is chained, it will be picked
    // up by the user's `.thenX()`.
    double(...initialArgs)

    const replaceLastReturn = (method, fn) => td.when().thenReturn({ [method]: fn })

    return new Proxy(
      { double, replaceLastReturn },
      { get: methodGetter }
    )
  }
}

function getMethodProxy(double) {
  const replaceLastReturn = (method, fn) => double[method] = fn
  return new Proxy({ double, replaceLastReturn }, { get: methodGetter })
}

function methodGetter({ double, replaceLastReturn }, method) {
  return (...args) => {
    // Ensure that when the previous TD is called with the correct arguments, this new TD is returned
    const next = td.function()
    replaceLastReturn(method, next)

    // Call the new TD with the correct args. This call will be picked up by a .thenX() either when
    // the next segment is provided, or by the user's td.when() that wraps this chain builder.
    next(...args)

    // We don't know what this function needs to return yet, but we build a function to set its
    // return value later.
    const replaceThisReturn = (method, fn) => td.when().thenReturn({ [method]: fn })

    return new Proxy({ double, replaceLastReturn: replaceThisReturn }, { get: methodGetter })
  }
}
