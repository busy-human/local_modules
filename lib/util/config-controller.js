// Local Modules Config Manager
// Writes and reads to the package.json local_modules config

var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const {read, write, addDependency} = require("./package-io.js");
const { cleanLocalModule, linkLocalToModuleSource, copyLocalModuleToNode, copyLocalToModuleSource, coerceLocalModulesDirectory } = require("./module-writer.js");
const {resolveLocalModulePath, resolveModuleScope} = require("./module-util.js");

module.exports.read = read;
module.exports.write = write;
module.exports.cleanLocalModule = cleanLocalModule;
module.exports.linkLocalToModuleSource = linkLocalToModuleSource;
module.exports.copyLocalModuleToNode = copyLocalModuleToNode;
module.exports.copyLocalToModuleSource = copyLocalToModuleSource;
module.exports.resolveLocalModulePath = resolveLocalModulePath;
module.exports.resolveModuleScope = resolveModuleScope;
module.exports.addDependency = addDependency;
module.exports.coerceLocalModulesDirectory = coerceLocalModulesDirectory;

function forEachLocalModulePath(options, fn) {
    const local_modules = read(options);
    var keys = Object.keys(local_modules.paths);
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var _path = local_modules.paths[name];
        fn(name, _path);
    }
}
module.exports.forEachLocalModulePath = forEachLocalModulePath;