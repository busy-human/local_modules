const fs = require('fs');
const path = require('path');
const PackageJsonController = require("./package-json-controller");
const { resolveModulePackage } = require("./module-util.js");


class PackageController {
    constructor(packagePath, options) {
        this.cachedLocalModules = {};
        this.json = new PackageJsonController(packagePath, options);
    }
    /**
     *
     * @param {*} relativePath
     * @returns {import('../types.js').LocalModuleDefinition|null}
     */
    cachedLocalModuleByRelativePath(relativePath) {
        var keys = Object.keys(this.cachedLocalModules);
        for (var i = 0; i < keys.length; i++) {
            var mod = this.cachedLocalModules[keys[i]];
            if (mod.relativePath === relativePath) {
                return mod;
            }
        }
        return null;
    }

    /**
     *
     * @param {*} relativePath
     * @returns {import('../types.js').LocalModuleDefinition|null}
     */
    findDependencyByPath(relativePath) {
        // Resolve full path
        var mod = this.cachedLocalModuleByRelativePath(relativePath);
        if (!mod) {
            var fullPath = path.resolve(process.cwd(), relativePath);
            var depPackage = resolveModulePackage(fullPath);
            mod = { fullPath, package: depPackage, relativePath };
            this.cachedLocalModules[depPackage.name] = mod;
        }

        return mod;
    }

    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     * @param {string} relativePath
     * @returns
     */
     addDependency(relativePath) {
        var pkg = this.findDependencyByPath(relativePath).package;

        // Read dependency pkg name
        console.log(`Found local module: ${pkg.name}`);

        if(this.json.local_modules.paths[pkg.name]) {
            console.log("Dependency already in pkg, updating");
        }

        this.json.recordDependency( relativePath, pkg.name );

        return { package: pkg };
    }
}


module.exports = PackageController;