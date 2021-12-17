var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, write } = require("../util/config-controller");
const linkNode = require('./link-node');
const Packages = require("../util/packages.js");

module.exports = function add(options) {
  options.addPath = options._[1];
  if(!options.addPath) {
    throw new Error(`'lm add <path>' requires a path provided`);
  }

  var pkg = Packages.loadPackage( options.addPath );
  Packages.root.addDependency(pkg, options.addPath);

  if(options.modules.indexOf(pkg.json.name) === -1) {
    options.modules.push(pkg.json.name);
  }

  Packages.root.local_modules.linkLocalToModuleSource(options.addPath);

  // Link the folders to node_modules
  linkNode(options);

  // add local modules
  options.modules.forEach(function(module) {
    var modulePath = path.join(options.dir, module);
    Packages.root.json.dependencies[module] = 'file:' + modulePath;
    console.log('add local dependency:', module, ':', 'file:' + modulePath);
  });

  // write modified package.json
  Packages.root.json.write();
};
