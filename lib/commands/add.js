var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, write } = require("../util/config-controller");
const linkNode = require('./link-node');

module.exports = function add(options) {
  options.addPath = options._[1];
  if(!options.addPath) {
    throw new Error(`'lm add <path>' requires a path provided`);
  }

  var { package } = options.pkg.addDependency(options.addPath);
  if(options.modules.indexOf(package.name) === -1) {
    options.modules.push(package.name);
  }

  linkLocalToModuleSource(options, options.addPath);

  // Link the folders to node_modules
  linkNode(options);

  // add local modules
  options.modules.forEach(function(module) {
    var modulePath = path.join(options.dir, module);
    options.pkg.json.dependencies[module] = 'file:' + modulePath;
    console.log('add local dependency:', module, ':', 'file:' + modulePath);
  });

  // write modified package.json
  options.pkg.json.write();
};
