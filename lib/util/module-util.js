var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");


/**
 * Reads a local_module package
 * @param {*} fullPath
 * @returns
 */
function resolveModulePackage( fullPath ) {
    var depPackagePath = path.resolve(fullPath, "package.json");

    // Find package
    if(!fs.existsSync(depPackagePath)) {
        console.warn(`Package not found: ${depPackagePath}`);
        throw new Error(`Path does not refer to a package ${relativePath}`);
    }
    return JSON.parse( fs.readFileSync(depPackagePath, "utf8") );
}
module.exports.resolveModulePackage = resolveModulePackage;


/**
 *
 * @param {*} options
 * @param {packageName} packageName
 * @returns {string|null}
 */
 function resolveModuleScope( packageName) {
    if(packageName.indexOf("@") >= 0 && packageName.indexOf("/") >= 0) {
        return packageName.split("/")[0];
    } else {
        return null;
    }
}
module.exports.resolveModuleScope = resolveModuleScope;


function moduleContainsLocalModules(fullPath) {
    var package = resolveModulePackage(fullPath);
    if(package && package.local_modules) {
        return true;
    } else {
        return false;
    }
}
module.exports.moduleContainsLocalModules = moduleContainsLocalModules;