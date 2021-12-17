var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const { packNestedModules } = require('./nested-modules.js');
const Packages = require('./packages.js');
const Globals = require('./globals.js');



class LocalModuleDirectoryController {
    /**
     *
     * @param {import('./package-controller.js')} controller
     */
    constructor(controller) {
        this.pkg = controller;
    }
    /**
     * Ensures the local_modules directory exists
     */
    coerceDirectory() {
        var localModulesPath = this.pkg.paths.local_modules;

        if(!fs.existsSync(localModulesPath)) {
            fs.mkdirSync(localModulesPath);
        }
    }
    /**
     *
     * @param {string} packageName
     */
    coercePath(packageName) {
        this.coerceDirectory();
        this.coerceScopedModulePath(packageName);
    }
    /**
     * Ensures the scope folder exists for the given scope (if any)
     * @param {string} packageName
     */
    coerceScopedModulePath(packageName) {
        var moduleScope = this.pkg.paths.resolveModuleScope(packageName);
        if(moduleScope) {
            var moduleScopePath = path.resolve(this.pkg.paths.local_modules, moduleScope);
            if(!fs.existsSync(moduleScopePath)) {
                fs.mkdirSync(moduleScopePath);
            }
        }
    }
    /**
     * Cleans up any existing copy or link of the local module in the local_modules directory
     * @param {string} packageName
     */
     clean(packageName) {
        var symlinkPath = this.pkg.paths.resolveLocalModule(packageName);
        try {
            fs.unlinkSync(symlinkPath);
        } catch(err) {

        }
        if(fs.existsSync(symlinkPath)) {
            rimraf.sync(symlinkPath);
        }
    }
    linkLocalToModuleSource(relativePath) {
        var pkg = Packages.loadPackage(relativePath).package;
        var sourceDirectory = pkg.paths.modulePath;
        var symlinkPath = this.pkg.paths.resolveLocalModule(pkg.json.name);

        this.clean(pkg.json.name);
        this.coercePath(pkg.json.name);

        console.log(`Linking local_module: ${pkg.json.name}`);

        // Create the symlink
        fs.symlinkSync(sourceDirectory, symlinkPath, "dir");
    }
    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     * @param {string} relativePath
     */
    copyLocalToModuleSource(relativePath) {
        var sourcePackage = Packages.loadPackage(relativePath).package;
        var local_modules = this.pkg.json.local_modules;
        var sourceDirectory = sourcePackage.paths.modulePath;
        var localPath = this.pkg.paths.resolveLocalModule(sourcePackage.json.name);

        this.pkg.local_modules.clean(sourcePackage.json.name);
        this.pkg.local_modules.coercePath(sourcePackage.json.name);
        packNestedModules(sourcePackage, sourceDirectory);

        console.log(`Copying local_module: ${sourcePackage.json.name}`);
        // Copy the file in
        // exec(`cp -R "${sourceDirectory}" "${localPath}"`);
        exec(`cd "${sourceDirectory}"; npm pack --pack-destination "${this.pkg.paths.local_modules}"`);
        this.pkg.json.setTarballDependency(sourcePackage);
    }
}

module.exports.LocalModuleDirectoryController = LocalModuleDirectoryController;
