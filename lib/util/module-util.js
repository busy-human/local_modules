var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");








function moduleContainsLocalModules(fullPath) {
    var package = resolveModulePackage(fullPath);
    if(package && package.local_modules) {
        return true;
    } else {
        return false;
    }
}
module.exports.moduleContainsLocalModules = moduleContainsLocalModules;