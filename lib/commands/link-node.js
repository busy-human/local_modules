var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var exec = require('exe');

const { resolveModuleScope } = require('../util/config-controller');
const Packages = require('../util/packages');
const PackageInstaller = require("../util/package-installer.js");
const { Logger } = require('../util/logger');

/**
 *
 * @param {import('../types').GlobalCommandOptions} options
 */
module.exports = function linkNode(options) {

  // unlink existing links/folders first.
  // unlink(options);

  // make sure the node_modules folder exists
  // mkdirp.sync(path.resolve(options.nodeModules));

  // link local modules
  var cwd = process.cwd();
  options.modules.forEach(function(_mod) {
    // get absolute paths
    var src = path.resolve(path.join(options.dir, _mod));
    var dest = path.resolve(path.join(options.nodeModules, _mod));
    Logger.log('add local dependency link:', src, ' -> ', dest);

    // Packages.root.node_modules.coerceScopedModulePath(_mod);

    // check src type
    var stat = fs.statSync(src);
    var type = stat.isDirectory() ? 'dir' : 'file';

    try {
      // fs.unlinkSync(dest);
    } catch (err) {

    }

    // create the symlink
    try {
      // if(fs.existsSync(dest)) {
      //   fs.rmdirSync(dest);
      // }
      // fs.symlinkSync(src, dest, type);

      // install dependencies
      try {
        process.chdir(src);
        Logger.log('install dependencies', process.cwd(), src);
        if(fs.existsSync(path.resolve(src, "yarn.lock"))) {
          exec("yarn install --ignore-scripts");
        } else {
          exec('npm install --ignore-scripts');
        }
      } catch (e) {
        Logger.log('installing dependencies failed for', src, 'ERROR:', e.message);
      } finally {
        process.chdir(cwd);
      }

    } catch (e) {
      Logger.error(e);
      Logger.log('creating symlink failed: ', e.code);
    }

    // add local modules
    options.modules.forEach(function(packageName) {
      Packages.root.json.updateDependency( packageName );
    });


  });

  // Install any packages changed
  PackageInstaller.install();
  // // Install root directory
  // if(fs.existsSync(path.resolve(process.cwd(), "yarn.lock"))) {
  //   exec("yarn install --ignore-scripts");
  // } else {
  //   exec('npm install --ignore-scripts');
  // }

};
