var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var exec = require('exe');

var add = require('./add');
var remove = require('./remove');
const { forEachLocalModulePath } = require('../util/config-controller');
const linkNode = require('./link-node');
const Packages = require('../util/packages');

module.exports = function install(options) {

  forEachLocalModulePath(options, (name, _path) => {
    Packages.root.local_modules.linkLocalToModuleSource(_path);
    Packages.root.json.updateDependency( name );
  });

  // Link the folders to node_modules
  linkNode(options);

  // // copy package.json -> package.json.tmp
  // fs.writeFileSync(options.packagePath + options.tmp, options.packageJSON);

  // // add local modules
  // PackageInstaller.add(options);

  // // options.force: delete local modules inside node_modules first
  // if (options.force) {
  //   // delete node_modules first
  //   options.modules.forEach(function(module) {
  //     var modulePath = path.resolve(path.join(options.nodeModules, module));
  //     rimraf.sync(modulePath);
  //   });
  // }

  // // run npm install again `--ignore-scripts` is needed for endles loop when called via npm [...]install script.
  // console.log('install local dependencies');
  // exec('npm install --ignore-scripts');

  // // restore original package.json
  // remove(options);

};
