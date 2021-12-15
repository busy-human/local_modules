var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const {resolveLocalModulePath, resolveModuleScope, resolveModulePackage} = require("./module-util.js");
const cachedLocalModules = {};

/**
 *
 * @param {*} relativePath
 * @returns {import('../types.js').LocalModuleDefinition|null}
 */
 function cachedLocalModuleByRelativePath(relativePath) {
    var keys = Object.keys(cachedLocalModules);
    for(var i = 0; i < keys.length; i++) {
        var mod = cachedLocalModules[ keys[i] ];
        if(mod.relativePath === relativePath) {
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
 function findDependencyByPath(relativePath) {
    // Resolve full path
    var mod = cachedLocalModuleByRelativePath( relativePath );
    if(!mod) {
        var fullPath = path.resolve(process.cwd(), relativePath);
        var depPackage = resolveModulePackage(fullPath);
        mod = { fullPath, package: depPackage, relativePath };
        cachedLocalModules[depPackage.name] = mod;
    }

    return mod;
}
module.exports.findDependencyByPath = findDependencyByPath;

/**
 * Cleans up any existing copy or link of the local module in the local_modules directory
 * @param {*} options
 * @param {string} packageName
 */
 function cleanNodeModule(options, packageName) {
    var symlinkPath = path.resolve(process.cwd(), "node_modules", packageName);
    try {
        fs.unlinkSync(symlinkPath);
    } catch(err) {

    }
    if(fs.existsSync(symlinkPath)) {
        rimraf.sync(symlinkPath);
    }
}

/**
 * Cleans up any existing copy or link of the local module in the local_modules directory
 * @param {*} options
 * @param {string} packageName
 */
 function cleanLocalModule(options, packageName) {
    var symlinkPath = resolveLocalModulePath(options, packageName);
    try {
        fs.unlinkSync(symlinkPath);
    } catch(err) {

    }
    if(fs.existsSync(symlinkPath)) {
        rimraf.sync(symlinkPath);
    }
}

module.exports.cleanLocalModule = cleanLocalModule;



function coerceLocalModulesDirectory(options) {
    var localModulesPath = path.resolve(process.cwd(),  `${options.dir}`);

    if(!fs.existsSync(localModulesPath)) {
        fs.mkdirSync(localModulesPath);
    }
}
module.exports.coerceLocalModulesDirectory = coerceLocalModulesDirectory;

/**
 *
 * @param {import('../types.js').LocalModuleDefinition} package
 */
function coerceLocalModulePath(options, package) {
    coerceLocalModulesDirectory(options);
    coerceScopedModulePath(options.dir, package.name);
}

function coerceScopedModulePath( basePath, packageName) {
    var moduleScope = resolveModuleScope(packageName);
    if(moduleScope) {
        var moduleScopePath = path.resolve(process.cwd(), basePath, moduleScope);
        if(!fs.existsSync(moduleScopePath)) {
            fs.mkdirSync(moduleScopePath);
        }
    }
}
module.exports.coerceScopedModulePath = coerceScopedModulePath;



function linkLocalToModuleSource(options, relativePath) {
    var { fullPath, package } = findDependencyByPath(relativePath);
    var sourceDirectory = fullPath;
    var symlinkPath = resolveLocalModulePath(options, package.name);

    cleanLocalModule(options, package.name);
    coerceLocalModulePath(options, package);

    console.log(`Linking local_module: ${package.name}`);

    // Create the symlink
    fs.symlinkSync(sourceDirectory, symlinkPath, "dir");
}
module.exports.linkLocalToModuleSource = linkLocalToModuleSource;

function resolveTarBallName(package) {
    var baseName = package.name.replace(/@/gi,'').replace(/\//gi, '-');
    return `${baseName}-${package.version}.tgz`;
}

function copyLocalToModuleSource(options, relativePath) {
    var { fullPath, package } = findDependencyByPath(relativePath);
    var sourceDirectory = fullPath;
    var localPath = resolveLocalModulePath(options, package.name);

    cleanLocalModule(options, package.name);
    coerceLocalModulePath(options, package);

    if(moduleContainsLocalModules(sourceDirectory)) {
        exec(`cd "${sourceDirectory}"; lm pack`);
    }

    console.log(`Copying local_module: ${package.name}`);
    var tarPath = `${options.dir}/${resolveTarBallName(package)}`;

    // Copy the file in
    // exec(`cp -R "${sourceDirectory}" "${localPath}"`);
    exec(`cd "${sourceDirectory}"; npm pack --pack-destination "${options.dirPath}"`);
    options.pkg.dependencies[package.name] = `file:${tarPath}`;
}
module.exports.copyLocalToModuleSource = copyLocalToModuleSource;


function copyLocalModuleToNode(options, relativePath) {
    var node_modules_path = path.resolve( process.cwd(), "node_modules" );
    var { fullPath, package } = findDependencyByPath(relativePath);
    var sourceDirectory = fullPath;
    var localPath = path.resolve( node_modules_path, package.name);

    cleanNodeModule(options, package.name);
    coerceScopedModulePath(node_modules_path, package.name);

    console.log(`Copying local_module to node_modules: ${package.name}`);

    // Copy the file in
    exec(`cp -R "${sourceDirectory}" "${localPath}"`);
}
module.exports.copyLocalModuleToNode = copyLocalModuleToNode;


