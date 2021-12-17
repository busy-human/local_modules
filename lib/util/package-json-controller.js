const fs = require('fs');
const path = require('path');
const merge = require("lodash.merge");
const Globals = require('./globals.js');


const package_defaults = {
    dependencies: {},
    local_modules: {
        paths: {},
        packed: {},
        tempPacked: {}
    }
};


class PackageJsonController {
    /**
     *
     * @param {import('./package-controller.js')} controller
     */
    constructor( controller ) {
        this.pkg = controller;
        this.read();
    }

    read() {
        this.packageString = fs.readFileSync(this.pkg.paths.packageJson, 'utf8');
        this.obj = merge({}, package_defaults, JSON.parse(this.packageString));
    }

    /**
     * @returns {import('../types.js').PackageLocalModuleConfig}
     */
    get local_modules() {
        return this.obj.local_modules;
    }
    /**
     * @returns {import('../types.js').PackageDependencies}
     */
    get dependencies() {
        return this.obj.dependencies;
    }

    /** @returns {string} */
    get name() {
        return this.obj.name;
    }

    get version() {
        return this.obj.version;
    }
    sync() {
        this.write();
        this.read();
    }
    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     */
    write() {
        var str = JSON.stringify(this.obj, null, 4);
        fs.writeFileSync(this.pkg.paths.packageJson, str);
    }

    addTempTarballWithPath( moduleName, tarPath ) {
        this.dependencies[moduleName] = `file:${tarPath}`;
        this.local_modules.tempPacked[moduleName] = tarPath;
        this.write();
    }

    setTarballDependency( targetPackage ) {
        var tarPath = `${Globals.dir}/${this.pkg.paths.resolveTarBallName(targetPackage.json.obj)}`;
        this.dependencies[targetPackage.json.name] = `file:${tarPath}`;
        this.local_modules.packed[targetPackage.json.name] = tarPath;
        this.write();
    }

    recordDependency( relativePath, packageName ) {
        this.local_modules.paths[packageName] = relativePath;
        var localPath = `${this.pkg.paths.local_modules}/${packageName}`;
        this.obj.dependencies[packageName] = "file: " + localPath;
        this.write();
    }

    recordTemporaryDependency( relativePath, packageName ) {
        // Only record it if its not already a dependency
        if(!this.obj.dependencies[packageName]) {
            this.local_modules.tempPacked[packageName] = relativePath;
            var localPath = `${this.pkg.paths.local_modules}/${packageName}`;
            this.obj.dependencies[packageName] = "file: " + localPath;
            this.write();
        }
    }
}

module.exports = PackageJsonController;
