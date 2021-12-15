// Local Modules Config Manager
// Writes and reads to the package.json local_modules config

var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const {read, write, addDependency} = require("./package-io.js");
const { cleanLocalModule, linkLocalToModuleSource, copyLocalModuleToNode, copyLocalToModuleSource } = require("./module-writer.js");
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

/**
 * @typedef {object} LocalModuleDefinition
 * @property {string} fullPath
 * @property {object} package
 * @property {string} relativePath
 */

const cachedLocalModules = {};

/**
 *
 * @param {*} relativePath
 * @returns {LocalModuleDefinition|null}
 */
function cachedLocalModuleByRelativePath(relativePath) {
    var keys = Object.keys(cachedLocalModules);
    for(var i = 0; i < keys.length; i++) {
        var mod = cachedLocalModules[ keys[i] ];
        if(mod.relativePath === relativePath) {
            return mod;
        }
    }
    return null;
}

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

function resolveModulePackage( fullPath ) {
    var depPackagePath = path.resolve(fullPath, "package.json");

    // Find package
    if(!fs.existsSync(depPackagePath)) {
        console.warn(`Package not found: ${depPackagePath}`);
        throw new Error(`Path does not refer to a package ${relativePath}`);
    }
    return JSON.parse( fs.readFileSync(depPackagePath, "utf8") );
}

function moduleContainsLocalModules(fullPath) {
    var package = resolveModulePackage(fullPath);
    if(package && package.local_modules) {
        return true;
    } else {
        return false;
    }
}
module.exports.moduleContainsLocalModules = moduleContainsLocalModules;