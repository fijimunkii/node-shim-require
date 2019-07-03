module.exports = shimRequire;

var Module = require('module');
var fs = require('fs');
var path = require('path');

/**
 * Whenever a .js file is run via require(), calls callback with the contents
 * of the required file, the name of the required file, and the module object
 * for the required module. callback should return the processed contents of
 * the file, which will be executed instead of the original contents.
 * @param {function(string, string, !Module):string} callback
 */
function shimRequire(callback) {
  // adapted from https://github.com/joyent/node/blob/master/lib/module.js
  Module._extensions['.js'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    content = stripBOM(content);
    content = stripShebang(content);

    module._compile(callback(content, filename, module), filename);
  };

  // taken from https://github.com/joyent/node/blob/master/lib/module.js
  function stripBOM(content) {
    // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM) because
    // the buffer-to-string conversion in `fs.readFileSync()` translates it to
    // FEFF, the UTF-16 BOM.
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  function stripShebang(content) {
    if (/^#!/.test(content)) {
      return content.replace(/[^\r\n]+(\r|\n)/, '$1');
    }
    return content;
  }
}
