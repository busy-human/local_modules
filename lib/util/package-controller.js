const fs = require('fs');
const path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const PackageJsonController = require("./package-json-controller");
const { resolveModulePackage } = require("./module-util.js");
const PackagePaths = require('./package-paths');
const { LocalModuleDirectoryController } = require('./module-writer');
const NodeModuleDirectoryController = require('./node-module-directory-controller');


class PackageController {
    constructor(packagePath) {
        this.paths = new PackagePaths(packagePath);
        this.json = new PackageJsonController(this);
        this.local_modules = new LocalModuleDirectoryController(this);
        this.node_modules = new NodeModuleDirectoryController(this);
    }

    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     * @param {PackageController} pkg
     * @param {string} relativePath
     * @returns {PackageController}
     */
     addDependency(pkg, relativePath) {
        // Read dependency pkg name
        console.log(`Found local module: ${pkg.json.name}`);

        if(this.json.local_modules.paths[pkg.json.name]) {
            console.log("Dependency already in pkg, updating");
        }

        this.json.recordDependency( relativePath, pkg.json.name );

        return pkg;
    }


}


module.exports = PackageController;