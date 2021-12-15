/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
var fs = require('fs');
const { findDependencyByPath } = require("./module-writer.js");


const defaults = {
    paths: {}
};

/**
 *
 * @param {import('../types.js').GlobalCommandOptions} options
 * @returns
 */
function read(options) {
    var resolved = Object.assign({}, defaults, options.pkg.local_modules);
    options.pkg.local_modules = resolved;
    return resolved;
};
module.exports.read = read;

/**
 *
 * @param {import('../types.js').GlobalCommandOptions} options
 */
function write(options) {
    var str = JSON.stringify(options.pkg, null, 4);
    fs.writeFileSync(options.packagePath, str);
};
module.exports.write = write;

/**
 *
 * @param {import('../types.js').GlobalCommandOptions} options
 * @param {string} relativePath
 * @returns
 */
function addDependency(options, relativePath) {
    var local_modules = read(options);
    var { package } = findDependencyByPath(relativePath);

    // Read dependency package name
    console.log(`Found local module: ${package.name}`);

    if(local_modules.paths[package.name]) {
        console.log("Dependency already in package, updating");
    }

    local_modules.paths[package.name] = relativePath;
    var localPath = `${options.dir}/${package.name}`;
    options.pkg.dependencies[package.name] = "file: " + localPath;
    write(options);

    return { package };
}
module.exports.addDependency = addDependency;