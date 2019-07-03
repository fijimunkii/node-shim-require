# shim-require

Pre-process javascript files as they get `require`d

```js

const shimRequire = require('shim-require');
shimRequire(function(content, filename, module) {
  return `console.log("loading ${filename}");\n${content}`;
});

require('foo'); // `loading /path/to/foo`
```
