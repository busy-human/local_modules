var fs = require('fs');
const Packages = require('../util/packages');

module.exports = function remove(options) {

  // with option force, always remove local modules, alo when they were existing in the orignial package.json
  if (options.force) {
    try {
      // fs.unlinkSync(options.packagePath + options.tmp);
    } catch (e) {
      // it's o.k. if the .tmp file does not exist.
    } finally {}
    return _remove();
  }

  try {
    // try restore original package.json
    // fs.statSync(options.packagePath + options.tmp);
    // fs.renameSync(options.packagePath + options.tmp, options.packagePath);

  } catch (e) {
    _remove();
  }

  function _remove() {
    // remove local dependencies from package.json
    options.modules.forEach(function(module) {
      delete Packages.root.json.dependencies[module];
      console.log('remove local dependency:', module);
    });
  }

};
