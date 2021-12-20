const fs = require('fs');
const path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const PackageJsonController = require("./package-json-controller");
const PackagePaths = require('./package-paths');
const { LocalModuleDirectoryController } = require('./local-module-directory-controller');
const NodeModuleDirectoryController = require('./node-module-directory-controller');
const LocalModulesRcController = require("./local-modules-rc-controller.js");
const { Logger } = require('./logger');

class PackageController {
    constructor(packagePath) {
        this.paths = new PackagePaths(packagePath);
        this.json = new PackageJsonController(this);
        this.local_modules = new LocalModuleDirectoryController(this);
        this.node_modules = new NodeModuleDirectoryController(this);
        this.rc = new LocalModulesRcController(this);
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
        Logger.log(`Found local module: ${pkg.json.name}`);

        if(this.json.local_modules.paths[pkg.json.name]) {
            Logger.log(`${pkg.json.name} already in package.json, updating`);
        }

        this.json.recordDependency( relativePath, pkg.json.name );

        return pkg;
    }


}


module.exports = PackageController;