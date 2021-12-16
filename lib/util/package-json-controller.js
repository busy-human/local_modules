const fs = require('fs');
const path = require('path');


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
     * @param {import('./package-controller.js')} controller
     */
    constructor( controller ) {
        this.pkg = controller;
        this.read();
    }

    read() {
        this.packageString = fs.readFileSync(this.pkg.paths.packageJson, 'utf8');
        this.obj = Object.assign( {}, package_defaults, JSON.parse(this.packageString));
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
    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     */
    write() {
        var str = JSON.stringify(this.obj, null, 4);
        fs.writeFileSync(this.pkg.paths.packageJson, str);
    }

    recordDependency( relativePath, packageName ) {
        this.local_modules.paths[packageName] = relativePath;
        var localPath = `${this.pkg.paths.local_modules}/${packageName}`;
        this.obj.dependencies[packageName] = "file: " + localPath;
        this.write();
    }
}

module.exports = PackageJsonController;
