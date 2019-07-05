const shimRequire = require('../index');
const promisify = require('util').promisify
const writeFile = promisify(require('fs').writeFile);
const path = require('path');
const mkpkg = async (pkgname, content) => {
  const filepath = path.join(__dirname, 'testpackages', pkgname);
  await writeFile(filepath, content);
  return filepath;
};

module.exports = t => {

  t.test('can modify required js file content', async t => {
    const pkg = await mkpkg('test1.js', `module.exports = 'foo';`);
    const replaceWith = 'bar';
    shimRequire(content => content.replace(/foo/,replaceWith));
    const d = require(pkg);
    t.same(d, replaceWith);
  });

  t.test('can modify required json file content', async t => {
    const pkg = await mkpkg('test2.json', `{ "a": "foo" }`);
    const replaceWith = 'bar';
    shimRequire(content => content.replace(/foo/,replaceWith), 'json');
    const d = require(pkg);
    t.same(d.a, replaceWith);
  });

};

if (!module.parent) module.exports(require('tap'));
