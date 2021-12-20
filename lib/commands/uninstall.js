var fs = require('fs');
var exec = require('exe');
const Packages = require('../util/packages');
const PackageInstaller = require("../util/package-installer.js");

module.exports = function uninstall(options) {
  Packages.root.rc.forEachModule((key, _path) => {
    PackageInstaller.remove(key);
  });

  // // remove local modules
  // try {
  //   // try restore original package.json
  //   // fs.statSync(options.packagePath + options.tmp);
  //   fs.unlinkSync(options.packagePath);
  //   // fs.renameSync(options.packagePath + options.tmp, options.packagePath);

  // } catch (e) {
  //   _remove();
  // }

  // function _remove() {
  //   // remove local dependencies from package.json
  //   options.modules.forEach(function(module) {
  //     delete Packages.root.json.dependencies[module];
  //     console.log('remove local dependency:', module);
  //   });
  // }

  // // run npm prune
  // console.log('remove local dependencies');
  // exec('npm prune');

};
