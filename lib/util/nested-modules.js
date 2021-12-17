/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");
const {moduleContainsLocalModules} = require("./module-util.js");
const Packages = require('./packages.js');

/**
 * Runs the pack command on local modules referenced in local_modules
 * AND copies/installs the tar file to this project
 * @param {import('./package-controller')} pkg
 * @param {string} moduleDirectory
 */
function packNestedModules(pkg, moduleDirectory) {
    if(moduleContainsLocalModules(pkg)) {
        // Write any outstanding changes before packing
        pkg.rc.write();
        exec(`cd "${moduleDirectory}"; lm pack`);

        // Read changes applied by lm pack command
        pkg.json.read();
        pkg.rc.read();
        copyNestedTarFiles(pkg, moduleDirectory);
    }
}
module.exports.packNestedModules = packNestedModules;

/**
 * Copies the tar files generated in a nested local module into this one
 * @param {import('./package-controller')} pkg
 * @param {string} moduleDirectory
 */
function copyNestedTarFiles(pkg, moduleDirectory) {
    const local_modules = pkg.json.local_modules;
    var keys = Object.keys(local_modules.packed);
    console.log("COPYING NESTED TAR FILES: ", pkg.json.name, keys);
    keys.forEach(k => {
        var tarPath = local_modules.packed[k];
        exec(`cd "${moduleDirectory}"; cp "./${tarPath}" "${Packages.root.paths.local_modules}"`);
        Packages.root.json.addTempTarballWithPath(k, tarPath);
    });
}