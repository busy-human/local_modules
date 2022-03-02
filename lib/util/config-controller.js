// Local Modules Config Manager
// Writes and reads to the package.json local_modules config

var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const PackageJsonController = require("./package-json-controller.js");
const LocalModuleDirectoryController = require('./local-module-directory-controller')
// const { linkLocalToModuleSource, copyLocalToModuleSource } = require("./local-module-directory-controller.js");
const {resolveModuleScope} = require("./module-util.js");
const Packages = require('./packages.js');

module.exports.linkLocalToModuleSource = LocalModuleDirectoryController.linkLocalToModuleSource;
module.exports.copyLocalToModuleSource = LocalModuleDirectoryController.copyLocalToModuleSource;
module.exports.resolveModuleScope = resolveModuleScope;
module.exports.PackageJsonController = PackageJsonController;

function forEachLocalModulePath(options, fn) {
    const local_modules = Packages.root.json.local_modules;
    var keys = Object.keys(local_modules.paths);
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var _path = local_modules.paths[name];
        fn(name, _path);
    }
}
module.exports.forEachLocalModulePath = forEachLocalModulePath;