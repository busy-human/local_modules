/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
const fs = require("fs");
const path = require("path");
const exec = require('exe');

function isYarnPackage( cwd ) {
  return fs.existsSync(path.resolve(cwd, "yarn.lock"));
}

/**
 * Returns a space-deliminted list of packages to install
 * @param {string|string[]} packages
 * @returns {string}
 */
function resolvePackagesArgument( packages ) {
  if(typeof packages === "string") {
    return packages;
  } else if (packages instanceof Array) {
    return packages.join(" ");
  } else {
    console.warn(packages);
    throw new Error(`Expected packages to be a string or an array, but got ${typeof packages}`);
  }
}

module.exports.install = function install(options) {
  // Install root directory
  if(isYarnPackage(process.cwd())) {
    exec("yarn install --ignore-scripts");
  } else {
    exec('npm install --ignore-scripts');
  }
};

module.exports.remove = function remove(packages) {
  console.log(`Uninstalling packages:`, packages);
  var packagesArg = resolvePackagesArgument(packages);
    // Install root directory
    if(isYarnPackage(process.cwd())) {
      exec(`yarn remove ${packagesArg}`);
    } else {
      exec(`npm uninstall ${packagesArg}`);
    }
};

module.exports.add = function add(packages) {
  console.log(`Installing packages:`, packages);
  var packagesArg = resolvePackagesArgument(packages);
    // Install root directory
    if(isYarnPackage(process.cwd())) {
      exec(`yarn add ${packagesArg}`);
    } else {
      exec(`npm install ${packagesArg}`);
    }
}