#!/usr/bin/env node

/**
 * module dependencies
 */
var fs = require('fs');
var path = require('path');
var defaults = require('defaults');

var c = require('./config');
const PackageController = require('./lib/util/package-controller.js');
const Globals = require('./lib/util/globals');
const Packages = require("./lib/util/packages.js");
Packages.controllerClass = PackageController;

// require all commands located in "./lib" folder
var commands = (function requireCommands(){

    var cmds = {};
    var p = path.join(__dirname, 'lib', 'commands');

    try {
        var scripts = fs.readdirSync(p);
        scripts.forEach(function(script){
            var cmd = path.basename(script, '.js');
            cmds[cmd] = require(path.join(p, script));
        });
    } catch(e) {
        console.error('could not read command scripts', e.message);
    }

    return cmds;

})();

/**
 *
 * @param o options:
 * --dir {String} local modules directory name
 */
module.exports = function localModules(o) {
    /**
   * get options right, the options object is used as a `blackboard` as well. lookup: blackboard design pattern.
   */
  /** @type {import('./lib/types.js').GlobalCommandOptions} */
    var options = defaults({}, o);
    defaults(options, c);

    /**
   *  early return commands
   */
    if (options.help || options.h || options.H) return commands.help(options);
    if (options.version || options.v || options.V) return commands.version(options);

    /**
   * arguments, alias, defaults etc.
   */
    options.cmd = options.cmd || options._[0] || '';
    options.force = options.force || options.f;
    options.modules = [];

    /**
   * basic processing: read local_modules and package.json
   */
    options.dirPath = path.join(process.cwd(), options.dir);
    options.packagePath = path.join(process.cwd(), options.package);

    Globals.dir = options.dir;
    Globals.package = options.package;



    // parse package.json
    options.pkg = new PackageController(options.packagePath);
    options.pkg.local_modules.coerceDirectory();

    Packages.setRootPackage( options.pkg );

    // try to read local_modules directory
    options.modules = resolveModules(options.dirPath);

    /**
   * handle commands
   */
    var executed = Object.keys(commands).some(function(command){
        if (options.cmd == command || options[command]) {
            commands[command](options);

            return true;
        }
    });

    if (!executed) console.log('no command provided');

};


function resolveModules(baseDirectory) {
    // try to read a local_module directory or subdirectory
    var directories = [];
    var initialResults = [];
    var modules = [];
    try {
        initialResults = fs.readdirSync(baseDirectory);
    } catch (e) {
        console.error('could not read local module directory: ' + e.message);
    }

    // remove non directories
    directories = initialResults.filter(function(entry) {
            var dir = path.join(baseDirectory, entry);
            return fs.statSync(dir).isDirectory();
    });

    directories.forEach(dir => {
        // Resolve Scoped Modules
        if(dir.indexOf("@") >= 0) {
            var scopedModules = resolveModules(path.resolve(baseDirectory, dir));
            scopedModules.forEach(sDir => {
                modules.push(`${dir}/${sDir}`);
            });
        } else {
            modules.push(dir)
        }
    });

    return modules;
}

/**
 * run from command line
 */
if (require.main === module) {
    var args = require('subarg')(process.argv.slice(2));
    module.exports(args);
}