const fs = require('fs');
const path = require('path');


/**
 * @typedef {object} PackageDependencies
 */


/**
 * @typedef {object} PackageLocalModuleConfig
 * @property {object} paths
 * @property {object} packed
 */

const package_defaults = {
    dependencies: {},
    local_modules: {
        paths: {},
        packed: {}
    }
};


class PackageJsonController {
    /**
     *
     * @param {import('./package-paths.js')} paths
     */
    constructor( paths ) {
        this.paths = paths;
        this.read();
    }

    read() {
        console.log(`PATHS`, this.paths);
        this.packageString = fs.readFileSync(this.paths.packageJson, 'utf8');
        this.obj = Object.assign( {}, package_defaults, JSON.parse(this.packageString));
    }

    /**
     * @returns {PackageLocalModuleConfig}
     */
    get local_modules() {
        return this.obj.local_modules;
    }
    /**
     * @returns {PackageDependencies}
     */
    get dependencies() {
        return this.obj.dependencies;
    }
    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     */
    write() {
        var str = JSON.stringify(this.obj, null, 4);
        fs.writeFileSync(this.paths.packageJson, str);
    }

    recordDependency( relativePath, packageName ) {
        this.local_modules.paths[packageName] = relativePath;
        var localPath = `${this.paths.local_modules}/${packageName}`;
        this.obj.dependencies[packageName] = "file: " + localPath;
        this.write();
    }
}

module.exports = PackageJsonController;
