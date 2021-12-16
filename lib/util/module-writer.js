var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const {resolveModuleScope, resolveModulePackage, moduleContainsLocalModules} = require("./module-util.js");
const { packNestedModules } = require('./nested-modules.js');
const Packages = require('./packages.js');



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
        console.log("SYMLINK PATH", symlinkPath);

        this.clean(pkg.json.name);
        this.coercePath(pkg.json.name);

        console.log(`Linking local_module: ${pkg.json.name}`);

        // Create the symlink
        console.log(sourceDirectory, symlinkPath);
        fs.symlinkSync(sourceDirectory, symlinkPath, "dir");
    }
}

module.exports.LocalModuleDirectoryController = LocalModuleDirectoryController;
















/**
 *
 * @param {import('../types.js').GlobalCommandOptions} options
 * @param {string} relativePath
 */
function copyLocalToModuleSource(options, relativePath) {
    var pkg = Packages.byRelativePath(relativePath);
    var local_modules = options.pkg.json.local_modules;
    var sourceDirectory = fullPath;
    var localPath = options.pkg.paths.resolveLocalModulePath(options, package.name);

    options.pkg.local_modules.clean(pkg.json.name);
    options.pkg.local_modules.coercePath(pkg);
    packNestedModules(options, sourceDirectory);

    console.log(`Copying local_module: ${pkg.json.name}`);
    var tarPath = `${options.dir}/${options.pkg.paths.resolveTarBallName(pkg)}`;

    // Copy the file in
    // exec(`cp -R "${sourceDirectory}" "${localPath}"`);
    exec(`cd "${sourceDirectory}"; npm pack --pack-destination "${options.dirPath}"`);
    options.pkg.json.dependencies[pkg.json.name] = `file:${tarPath}`;
    local_modules.packed[pkg.json.name] = tarPath;
}
module.exports.copyLocalToModuleSource = copyLocalToModuleSource;


function copyLocalModuleToNode(options, relativePath) {
    var node_modules_path = path.resolve( process.cwd(), "node_modules" );
    var pkg = Packages.byRelativePath(relativePath);
    var sourceDirectory = fullPath;
    var localPath = path.resolve( node_modules_path, pkg.json.name);

    options.pkg.node_modules.clean(pkg.json.name);
    options.pkg.node_modules.coerceScopedModulePath(pkg.json.name);

    console.log(`Copying local_module to node_modules: ${pkg.json.name}`);

    // Copy the file in
    exec(`cp -R "${sourceDirectory}" "${localPath}"`);
}
module.exports.copyLocalModuleToNode = copyLocalModuleToNode;


