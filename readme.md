# Pull stream collect

A modern version of the
[pull-stream collect sink](https://pull-stream.github.io/#collect) which returns
a promise rather than calling a callback.

```
collect()
```

```js
const {pull, values, map} = require('pull-stream')
const collect = require('psp-collect')

pull(values([1, 2, 3]), map(x => x * 2), collect()).then(console.log)
// [ 2, 4, 6 ]
```

## Abort

Aborting without an error will halt the process and return the value so far.

```
abort([err])
```

```js
const {pull, values} = require('pull-stream')
const collect = require('psp-collect')

const sink = collect()
sink.abort()
pull(values([1, 2, 3]), sink).then(console.log)
// []
```
