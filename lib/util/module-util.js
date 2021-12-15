var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

function resolveLocalModulePath(options, packageName) {
    return path.resolve(process.cwd(), `${options.dir}/${packageName}`);
}
module.exports.resolveLocalModulePath = resolveLocalModulePath;


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
