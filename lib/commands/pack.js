/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
var fs = require("fs");
var path = require('path');
var rimraf = require('rimraf');
const { read, copyLocalToModuleSource, forEachLocalModulePath, copyLocalModuleToNode } = require("../config-controller");
const moduleInstall = require("../module-install.js");

var unlink = require("./unlink.js");

module.exports = function pack(options) {
    console.log("Packing");
    console.log("Unlinking...");
    unlink(options);
    var local_modules = read(options);
    const keys = Object.keys(local_modules.paths);

    console.log("Copying in external local modules");
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var externalPath = local_modules.paths[name];
        copyLocalToModuleSource(options, externalPath);
    }
    moduleInstall(options);

    // Replace the linked npm modules
    console.log("Copying local modules into node_modules");
    forEachLocalModulePath(options, (name, _path) => {
        copyLocalModuleToNode(options, _path);
    });
    console.log("Packing done");
};