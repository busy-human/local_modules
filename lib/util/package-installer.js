const { Logger } = require("./logger");
const { add, remove } = require("./package-manager-control");

/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
class PackageInstaller {
    constructor() {
        this.packages = [];
        this.removedPackages = [];
    }
    addUniquePackage(pkg) {
        if(this.packages.indexOf(pkg) === -1) {
            this.packages.push(pkg);
        }
    }
    removeUniquePackage(pkg) {
        if(this.removedPackages.indexOf(pkg) === -1) {
            this.removedPackages.push(pkg);
        }
    }
    add(packages) {
        Logger.log(`Adding to install list: ${packages}`);
        if(typeof packages === "string") {
            this.addUniquePackage(packages);
          } else if (packages instanceof Array) {
            packages.forEach(p => this.addUniquePackage(p));
          } else {
            Logger.warn(packages);
            throw new Error(`Expected packages to be a string or an array, but got ${typeof packages}`);
          }
    }
    remove(packages) {
        Logger.log(`Adding ${packages} to remove list`);
        if(typeof packages === "string") {
            this.removeUniquePackage(packages);
          } else if (packages instanceof Array) {
            packages.forEach(p => this.removeUniquePackage(p));
          } else {
            Logger.warn(packages);
            throw new Error(`Expected packages to be a string or an array, but got ${typeof packages}`);
          }
    }
    popAllAdded() {
        var arg = this.packages.join(" ");
        while(this.packages.length > 0) {
            this.packages.pop();
        }
        return arg;
    }
    popAllRemoved() {
        var arg = this.removedPackages.join(" ");
        while(this.removedPackages.length > 0) {
            this.removedPackages.pop();
        }
        return arg;
    }
    install() {
        if(this.removedPackages.length > 0) {
            remove( this.popAllRemoved() );
        }
        if(this.packages.length > 0) {
            add( this.popAllAdded() );
        } else {
            Logger.log(`NO_PACKAGES: No packages need to be installed, so install is skipped`);
        }
    }
}

module.exports = new PackageInstaller();