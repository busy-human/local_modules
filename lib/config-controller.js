// Local Modules Config Manager
// Writes and reads to the package.json local_modules config

var fs = require('fs');
var path = require('path');
var exec = require('exe');
var rimraf = require("rimraf");

const defaults = {
    paths: {}
};

function read(options) {
    var resolved = Object.assign({}, defaults, options.pkg.local_modules);
    options.pkg.local_modules = resolved;
    return resolved;
};
module.exports.read = read;


/**
 * @typedef {object} LocalModuleDefinition
 * @property {string} fullPath
 * @property {object} package
 * @property {string} relativePath
 */

const cachedLocalModules = {};

/**
 *
 * @param {*} relativePath
 * @returns {LocalModuleDefinition|null}
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

function forEachLocalModulePath(options, fn) {
    const local_modules = read(options);
    var keys = Object.keys(local_modules.paths);
    for(var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var _path = local_modules.paths[name];
        fn(name, _path);
    }
}
module.exports.forEachLocalModulePath = forEachLocalModulePath;

function resolveModulePackage( fullPath ) {
    var depPackagePath = path.resolve(fullPath, "package.json");

    // Find package
    if(!fs.existsSync(depPackagePath)) {
        console.warn(`Package not found: ${depPackagePath}`);
        throw new Error(`Path does not refer to a package ${relativePath}`);
    }
    return JSON.parse( fs.readFileSync(depPackagePath, "utf8") );
}

/**
 *
 * @param {*} relativePath
 * @returns {LocalModuleDefinition|null}
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

function addDependency(options, relativePath) {
    var local_modules = read(options);
    var { package } = findDependencyByPath(relativePath);

    // Read dependency package name
    console.log(`Found local module: ${package.name}`);

    if(local_modules.paths[package.name]) {
        console.log("Dependency already in package, updating");
    }

    local_modules.paths[package.name] = relativePath;
    var localPath = `${options.dir}/${package.name}`;
    options.pkg.dependencies[package.name] = "file: " + localPath;
    write(options);

    return { package };
}
module.exports.addDependency = addDependency;

function resolveLocalModulePath(options, packageName) {
    return path.resolve(process.cwd(), `${options.dir}/${packageName}`);
}

/**
 *
 * @param {*} options
 * @param {packageName} packageName
 * @returns {string|null}
 */
function resolveModuleScope( packageName) {
    if(packageName.indexOf("@") >= 0 && packageName.indexOf("/") >= 0) {
        return packageName.split("/")[0];
    } else {
        return null;
    }
}
module.exports.resolveModuleScope = resolveModuleScope;

function coerceLocalModulesDirectory(options) {
    var localModulesPath = path.resolve(process.cwd(),  `${options.dir}`);

    if(!fs.existsSync(localModulesPath)) {
        fs.mkdirSync(localModulesPath);
    }
}
module.exports.coerceLocalModulesDirectory = coerceLocalModulesDirectory;

/**
 *
 * @param {LocalModuleDefinition.package} package
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

    // Copy the file in
    exec(`cp -R "${sourceDirectory}" "${localPath}"`);
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

function write(options) {
    var str = JSON.stringify(options.pkg, null, 4);
    fs.writeFileSync(options.packagePath, str);
};
module.exports.write = write;


function moduleContainsLocalModules(fullPath) {
    var package = resolveModulePackage(fullPath);
    if(package && package.local_modules) {
        return true;
    } else {
        return false;
    }
}
module.exports.moduleContainsLocalModules = moduleContainsLocalModules;