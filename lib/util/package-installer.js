const { add } = require("./package-manager-control");

/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
class PackageInstaller {
    constructor() {
        this.packages = [];
    }
    add(packages) {
        console.log(`Adding ${packages} to install list`);
        if(typeof packages === "string") {
            this.packages.push(packages);
          } else if (packages instanceof Array) {
            packages.forEach(p => this.packages.push(p));
          } else {
            console.warn(packages);
            throw new Error(`Expected packages to be a string or an array, but got ${typeof packages}`);
          }
    }
    resolvePackagesArgument() {
        return this.packages.join(" ");
    }
    popAll() {
        var arg = this.resolvePackagesArgument();
        while(this.packages.length > 0) {
            this.packages.pop();
        }
        return arg;
    }
    install() {
        if(this.packages.length > 0) {
            add( this.popAll() );
        } else {
            console.log(`NO_PACKAGES: No packages need to be installed, so install is skipped`);
        }
    }
}

module.exports = new PackageInstaller();