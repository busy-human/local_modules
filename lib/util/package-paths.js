const path = require('path');
const Globals = require('./globals');

/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
class PackagePaths {
    constructor( packagePath, options ) {
        this.names = {
            local_modules: Globals.dir
        };
        this.modulePath = path.dirname(packagePath);
        this.local_modules = path.resolve(this.modulePath, this.names.local_modules);
        this.node_modules = path.resolve(this.modulePath, "node_modules");
        this.packageJson = packagePath;
    }
    resolveLocalModule(packageName) {
        return path.resolve(this.local_modules, packageName);
    }
    /**
     *
     * @param {packageName} packageName
     * @returns {string|null}
     */
    resolveModuleScope( packageName ) {
        if(packageName.indexOf("@") >= 0 && packageName.indexOf("/") >= 0) {
            return packageName.split("/")[0];
        } else {
            return null;
        }
    }
    /**
     * Resolves the tarball name for a package
     * @param {import('../types').PackageJson} pkg
     * @returns
     */
    resolveTarBallName(pkg) {
        var baseName = pkg.name.replace(/@/gi,'').replace(/\//gi, '-');
        return `${baseName}-${pkg.version}.tgz`;
    }
}

module.exports = PackagePaths;