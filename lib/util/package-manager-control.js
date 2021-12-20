/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
const fs = require("fs");
const path = require("path");
const exec = require('exe');
const { Logger } = require("./logger");

function resolvePackageManager( cwd ) {
  if(fs.existsSync(path.resolve(cwd, "yarn.lock"))) {
    return Promise.resolve("yarn");
  } else if(fs.existsSync(path.resolve(cwd, "package-lock.json"))) {
    return Promise.resolve("npm");
  } else {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    Logger.log(`In directory: ${cwd}`);
    return new Promise((resolve, reject) => {
      readline.question('No package manager specified. Use npm or yarn? ', name => {
        if(name.toLowerCase().indexOf("y") >= 0) {
          resolve("yarn");
        } else {
          resolve("npm");
        }
        readline.close();
      });
    });

  }
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
    Logger.warn(packages);
    throw new Error(`Expected packages to be a string or an array, but got ${typeof packages}`);
  }
}

module.exports.install = function install(options) {
  // Install root directory
  return resolvePackageManager(process.cwd())
    .then(type => {
      if(type === "yarn") {
        exec("yarn install --ignore-scripts");
      } else {
        exec('npm install --ignore-scripts');
      }
    });

};

module.exports.remove = function remove(packages) {
  Logger.log(`Uninstalling packages:`, packages);
  var packagesArg = resolvePackagesArgument(packages);
  if(!packagesArg || packagesArg.length === 0) {
    throw new Error(`Cannot uninstall without packages specified`);
  }
  // Install root directory
  return resolvePackageManager(process.cwd())
    .then(type => {
      if(type === "yarn") {
        exec(`yarn remove ${packagesArg}`);
      } else {
        exec(`npm uninstall ${packagesArg}`);
      }
    });
};

module.exports.add = function add(packages) {
  Logger.log(`Installing packages:`, packages);
  var packagesArg = resolvePackagesArgument(packages);
  if(!packagesArg || packagesArg.length === 0) {
    throw new Error(`Cannot add without packages specified`);
  }
  // Install root directory
  return resolvePackageManager(process.cwd())
    .then(type => {
      if(type === "yarn") {
        exec(`yarn add ${packagesArg}`);
      } else {
        exec(`npm install ${packagesArg}`);
      }
    });
}