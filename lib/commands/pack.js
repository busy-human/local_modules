/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
var fs = require("fs");
var path = require('path');
var rimraf = require('rimraf');
const {install} = require("../util/package-manager-control.js");
const Packages = require("../util/packages.js");
const PackageInstaller = require("../util/package-installer.js");

var unlink = require("./unlink.js");

/**
 *
 * @param {import('../types.js').GlobalCommandOptions} options
 */
module.exports = function pack(options) {
    console.log("Packing");
    console.log("Unlinking...");
    unlink(options);
    var local_modules = Packages.root.json.local_modules;
    const keys = Object.keys(local_modules.paths);

    console.log("Copying in external local modules");
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var externalPath = local_modules.paths[name];
        Packages.root.local_modules.copyLocalToModuleSource(externalPath);
    }
    // Writes the package updates
    Packages.root.rc.write();
    PackageInstaller.install();

    console.log("Packing done");
};