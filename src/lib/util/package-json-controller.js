const fs = require('fs');
const path = require('path');
const merge = require("lodash.merge");
const Globals = require('./globals.js');
const { remove, add } = require('./package-manager-control.js');
const PackageInstaller = require("./package-installer.js");

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
        var moduleNames = [];
        this.pkg.rc.forEachTempPacked((name) => {
            moduleNames.push(name);
        });
        PackageInstaller.remove(moduleNames);
        this.pkg.rc.removeTemporaryModules();
        // this.write();
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
        // this.write();
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
        // this.write();
        PackageInstaller.add(`file:./${tarPath}`);
        this.read();
        this.pkg.rc.addTempTarballWithPath(moduleName, tarPath);
    }

    setTarballDependency( targetPackage ) {
        // this.write();
        var tarPath = `${Globals.dir}/${this.pkg.paths.resolveTarBallName(targetPackage.json.obj)}`;
        PackageInstaller.add(`file:./${tarPath}`);
        this.read();
        this.pkg.rc.setTarballDependency( targetPackage );
    }

    updateDependency( packageName ) {
        // this.write();
        var localPath = `${Globals.dir}/${packageName}`;
        PackageInstaller.add(`file:./${localPath}`);
        this.read();
    }

    recordDependency( relativePath, packageName ) {
        this.pkg.rc.addPath(packageName, relativePath);
        this.updateDependency( packageName );
        // this.write();
    }
}

module.exports = PackageJsonController;
