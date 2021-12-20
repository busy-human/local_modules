var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, write } = require("../util/config-controller");
const linkNode = require('./link-node');
const Packages = require("../util/packages.js");

module.exports = function add(options) {
  options.addPath = options._[1];
  if(!options.addPath) {
    throw new Error(`'lpm add <path>' requires a path provided`);
  }

  var pkg = Packages.loadPackage( options.addPath ).package;

  if(options.modules.indexOf(pkg.json.name) === -1) {
    options.modules.push(pkg.json.name);
  }

  Packages.root.local_modules.linkLocalToModuleSource(options.addPath);
  Packages.root.addDependency(pkg, options.addPath);

  // Link the folders to node_modules
  linkNode(options);
};
