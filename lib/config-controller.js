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
        var depPackagePath = path.resolve(fullPath, "package.json");

        // Find package
        if(!fs.existsSync(depPackagePath)) {
            console.warn(`Package not found: ${depPackagePath}`);
            throw new Error(`Path does not refer to a package ${relativePath}`);
        }
        var depPackage = JSON.parse( fs.readFileSync(depPackagePath, "utf8") );
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

function linkLocalToModuleSource(options, relativePath) {
    var { fullPath, package } = findDependencyByPath(relativePath);
    var sourceDirectory = fullPath;
    var symlinkPath = `${options.dir}/${package.name}`;

    if(fs.existsSync(symlinkPath)) {
        rimraf.sync(symlinkPath);
    }

    // Create the symlink
    fs.symlinkSync(sourceDirectory, symlinkPath, "dir");
}
module.exports.linkLocalToModuleSource = linkLocalToModuleSource;

function copyLocalToModuleSource(options, relativePath) {
    var { fullPath, package } = findDependencyByPath(relativePath);
    var sourceDirectory = fullPath;
    var localPath = `${options.dir}/${package.name}`;

    if(fs.existsSync(localPath)) {
        rimraf.sync(localPath);
    }

    // Create the symlink
    exec("cp ")
    fs.symlinkSync(sourceDirectory, localPath, "dir");
}
module.exports.copyLocalToModuleSource = copyLocalToModuleSource;

function write(options) {
    var str = JSON.stringify(options.pkg, null, 4);
    fs.writeFileSync(options.packagePath, str);
};
module.exports.write = write;