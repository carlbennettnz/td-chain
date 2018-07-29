# :link: td-chain

If you use [testdouble.js](https://github.com/testdouble/testdouble.js), you might have run into a bit of difficulty
mocking chained APIs. In most cases, you should probably just [avoid the problem](https://github.com/testdouble/contributing-tests/wiki/Don%27t-mock-what-you-don%27t-own).
If you're sure you want to do this, td-chain should help a little.

## Installation

```
npm install td-chain
```

## Usage

Say you have a module `./test/subject` that calls `./my/api` like this:

```js
module.exports = function subject() {
  return api('some args')
    .next('more args')
    .another('something else') // returns 42
}
```

You can mock out the call to `api()` like this:

```js
const td = require('testdouble')
const chain = require('td-chain')

const api = td.replace('./my/api')
const result = Symbol()

td.when(
  chain(api)('some args')
    .next('more args')
    .another('something else')
).thenReturn(result)

const subject = require('./test/subject')

assert(subject() === result)
```

For comparison, without td-chain:

```js
const td = require('testdouble')

const api = td.replace('./my/api')
const td2 = td.function()
const td3 = td.function()

const result = Symbol()

td.when(api('some args'))
  .thenReturn({ next: td2 })

td.when(td2('more args'))
  .thenReturn({ another: td3 })

td.when(td3('something else'))
  .thenReturn(result)

const subject = require('./test/subject')

assert(subject() === result)
```
