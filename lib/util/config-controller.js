// Local Modules Config Manager
// Writes and reads to the package.json local_modules config

var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const PackageJsonController = require("./package-json-controller.js");
const { linkLocalToModuleSource, copyLocalModuleToNode, copyLocalToModuleSource } = require("./module-writer.js");
const {resolveModuleScope} = require("./module-util.js");

module.exports.linkLocalToModuleSource = linkLocalToModuleSource;
module.exports.copyLocalModuleToNode = copyLocalModuleToNode;
module.exports.copyLocalToModuleSource = copyLocalToModuleSource;
module.exports.resolveModuleScope = resolveModuleScope;
module.exports.PackageJsonController = PackageJsonController;

function forEachLocalModulePath(options, fn) {
    const local_modules = Packges.root.json.read();
    var keys = Object.keys(local_modules.paths);
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var _path = local_modules.paths[name];
        fn(name, _path);
    }
}
module.exports.forEachLocalModulePath = forEachLocalModulePath;