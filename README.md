# shim-require

Pre-process javascript files as they get `require`d

```js
const shimRequire = require('shim-require');
shimRequire((content, filename) => {
  // return modified content
  return `console.log("loading ${filename}");\n${content}`;
});

require('foo'); // `loading /path/to/foo`
```

Can also modify json files
```js
shimRequire(content => content.replace(/foo/g, 'bar'), 'json');
require('foo.json'); // { "a": "bar" }
```
