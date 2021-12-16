var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var exec = require('exe');

var unlink = require('./unlink');
const { resolveModuleScope } = require('../util/config-controller');
const Packages = require('../util/packages');

/**
 *
 * @param {import('../types').GlobalCommandOptions} options
 */
module.exports = function linkNode(options) {

  // unlink existing links/folders first.
  unlink(options);

  // make sure the node_modules folder exists
  mkdirp.sync(path.resolve(options.nodeModules));

  // link local modules
  var cwd = process.cwd();
  options.modules.forEach(function(_mod) {
    // get absolute paths
    var src = path.resolve(path.join(options.dir, _mod));
    var dest = path.resolve(path.join(options.nodeModules, _mod));
    console.log('add local dependency link:', src, ' -> ', dest);

    Packages.root.local_modules.coerceScopedModulePath(options.nodeModules, _mod);

    // check src type
    var stat = fs.statSync(src);
    var type = stat.isDirectory() ? 'dir' : 'file';

    try {
      fs.unlinkSync(dest);
    } catch (err) {

    }

    // create the symlink
    try {
      if(fs.existsSync(dest)) {
        fs.rmdirSync(dest);
      }
      fs.symlinkSync(src, dest, type);

      // install dependencies
      try {
        process.chdir(src);
        console.log('install dependencies', process.cwd(), src);
        if(fs.existsSync(path.resolve(src, "yarn.lock"))) {
          exec("yarn install --ignore-scripts");
        } else {
          exec('npm install --ignore-scripts');
        }
      } catch (e) {
        console.log('installing dependencies failed for', src, 'ERROR:', e.message);
      } finally {
        process.chdir(cwd);
      }

    } catch (e) {
      console.error(e);
      console.log('creating symlink failed: ', e.code);
    }

  });

  // // Install root directory
  // if(fs.existsSync(path.resolve(process.cwd(), "yarn.lock"))) {
  //   exec("yarn install --ignore-scripts");
  // } else {
  //   exec('npm install --ignore-scripts');
  // }

};
