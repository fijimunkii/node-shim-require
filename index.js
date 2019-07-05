module.exports = shimRequire;

const Module = require('module');
const fs = require('fs');
const extensions = ['js','json'];
const defaultExtension = 'js';

// from https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js
function shimRequire(callback, extension) {
  if (extension && !extensions.includes(extension)) {
    throw `Invalid extension ${extension} - supported types ${extensions.join(',')}`;
  }
  if (!extension) {
    extension = defaultExtension;
  }
  if (extension === 'js') {
    Module._extensions['.js'] = function(module, filename) {
      let content = fs.readFileSync(filename, 'utf8');
      try {
        content = stripBOM(content);
        content = callback(content, filename, module);
        module._compile(content, filename);
      } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
      }
    };
  }
  else if (extension === 'json') {
    Module._extensions['.json'] = function(module, filename) {
      let content = fs.readFileSync(filename, 'utf8');
      try {
        content = stripBOM(content);
        content = callback(content, filename, module);
        module.exports = JSON.parse(content);
      } catch (err) {
        err.message = filename + ': ' + err.message;
        throw err;
      }
    }
  }
}

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
