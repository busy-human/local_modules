const path = require('path');

/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
class PackagePaths {
    constructor( packagePath, options ) {
        this.names = {
            local_modules: options.dir
        };
        this.modulePath = path.dirname(packagePath);
        this.local_modules = path.resolve(this.modulePath, this.names.local_modules);
        this.packageJson = packagePath;
    }
    resolveLocalModule(packageName) {
        return path.resolve(this.local_modules, packageName);
    }
}

module.exports = PackagePaths;