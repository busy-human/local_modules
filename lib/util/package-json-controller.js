const fs = require('fs');
const path = require('path');
const merge = require("lodash.merge");
const Globals = require('./globals.js');


const package_defaults = {
    dependencies: {}
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

    removeTemporaryModules() {
        this.pkg.rc.forEachTempPacked((name) => {
            delete this.dependencies[name];
        });
        this.pkg.rc.removeTemporaryModules();
        this.write();
    }
    /**
     * @returns {import('./local-modules-rc-controller.js')}
     */
    get local_modules() {
        return this.pkg.rc;
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
        this.pkg.rc.addTempTarballWithPath(moduleName, tarPath);
        this.write();
    }

    setTarballDependency( targetPackage ) {
        var tarPath = `${Globals.dir}/${this.pkg.paths.resolveTarBallName(targetPackage.json.obj)}`;
        this.dependencies[targetPackage.json.name] = `file:${tarPath}`;
        this.pkg.rc.setTarballDependency( targetPackage );
        this.write();
    }

    updateDependency( packageName ) {
        var localPath = `${Globals.dir}/${packageName}`;
        this.obj.dependencies[packageName] = "file:" + localPath;
    }

    recordDependency( relativePath, packageName ) {
        this.pkg.rc.addPath(packageName, relativePath);
        this.updateDependency( packageName );
        this.write();
    }
}

module.exports = PackageJsonController;
