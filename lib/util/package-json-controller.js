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
    constructor( packagePath, options ) {
        this.modulePath = path.dirname(packagePath);
        this.local_modules_dirname = options.dir;
        this.local_modules_dir = path.resolve(this.modulePath, this.local_modules_dirname);
        this.path = packagePath;
        this.read();
    }

    read() {
        this.packageString = fs.readFileSync(this.path, 'utf8');
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
        fs.writeFileSync(this.path, str);
    }

    recordDependency( relativePath, packageName ) {
        this.local_modules.paths[packageName] = relativePath;
        var localPath = `${this.local_modules_dirname}/${packageName}`;
        this.obj.dependencies[packageName] = "file: " + localPath;
        this.write();
    }
}

module.exports = PackageJsonController;
