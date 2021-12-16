/**
 * @typedef {object} RelativePathRecord
 * @property {string} relativePath
 * @property {import('./package-controller')} package
 */
const path = require("path");
const fs = require("fs");


const Packages = {
    controllerClass: null,

    root: null,

    /** @type {import('./package-controller')[]} */
    packages: [],

    /** @type {RelativePathRecord[]} */
    relativePathMap: [],

    setRootPackage( pkg ) {
        this.packages.push(pkg);
        this.relativePathMap.push({
            relativePath: ".",
            package: pkg
        });
        this.root = pkg;
    },

    /**
     * Loads in a package, JSON file, etc.
     * @param {string} relativePath
     * @returns
    */
    loadPackage( relativePath ) {
        var pkg = this.byRelativePath(relativePath);
        if(pkg) {
            // Already loaded, no need to reload
            return pkg;
        }
        var packagePath = path.resolve(process.cwd(), relativePath, "package.json");

        // Find package
        if(!fs.existsSync(packagePath)) {
            console.warn(`Package not found: ${packagePath}`);
            throw new Error(`Path does not refer to a package ${relativePath} (package.json not found)`);
        }

        pkg = new (this.controllerClass)( packagePath );

        // Check if we've already resolved the package without a relativePath
        var existingPkg = this.byName(pkg.json.name);
        if(!existingPkg) {
            this.packages.push(pkg);
        } else {
            pkg = existingPkg;
        }

        this.relativePathMap.push({
            relativePath,
            package: pkg
        });

        return pkg;
    },

    /**
     *
     * @param {string} relativePath
     * @returns {import('./package-controller')|null}
     */
    byRelativePath(relativePath) {
        return this.relativePathMap.find(rec => rec.relativePath === relativePath);
    },
    /**
     *
     * @param {string} name
     * @returns {import('./package-controller')|null}
     */
    byName(name) {
        return this.packages.find(pkg => pkg.json.name === name);
    }
};
module.exports = Packages;