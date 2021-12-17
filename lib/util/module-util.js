var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

/**
 *
 * @param {import('./package-controller')} pkg
 * @returns
 */
function moduleContainsLocalModules(pkg) {
    if(pkg.json && pkg.json.local_modules) {
        return true;
    } else {
        return false;
    }
}
module.exports.moduleContainsLocalModules = moduleContainsLocalModules;