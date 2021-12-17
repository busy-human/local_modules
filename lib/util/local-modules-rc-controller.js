const fs = require('fs');
const path = require('path');
const merge = require("lodash.merge");
const Globals = require('./globals.js');

/**
 * @type {import('../types.js').LocalModulesRcConfig}
 */
const defaults = {
    paths: {},
    packed: {},
    tempPacked: {}
};


class LocalModulesRcController {
    constructor(controller) {
        this.pkg = controller;
        this.read();
    }
    read() {
        if(!fs.existsSync(this.pkg.paths.rc)) {
            fs.writeFileSync(this.pkg.paths.rc, "{}", "utf8");
        }
        this.jsonString = fs.readFileSync(this.pkg.paths.rc, 'utf8');
        this.obj = merge({}, defaults, JSON.parse(this.jsonString));
    }
    get paths() {
        return this.obj.paths;
    }
    get packed() {
        return this.obj.packed;
    }
    get tempPacked() {
        return this.obj.tempPacked;
    }
    /**
     *
     * @param {import('../types.js').GlobalCommandOptions} options
     */
     write() {
        var str = JSON.stringify(this.obj, null, 4);
        fs.writeFileSync(this.pkg.paths.rc, str);
    }
    sync() {
        this.write();
        this.read();
    }
    removeTemporaryModules() {
        this.obj.tempPacked = {};
        this.write();
    }
    forgetPackedRecords() {
        this.obj.packed = {};
        this.write();
    }
    addTempTarballWithPath( moduleName, tarPath ) {
        this.obj.tempPacked[moduleName] = tarPath;
        this.write();
    }
    setTarballDependency( targetPackage ) {
        var tarPath = `${Globals.dir}/${this.pkg.paths.resolveTarBallName(targetPackage.json.obj)}`;
        this.obj.packed[targetPackage.json.name] = tarPath;
        this.write();
    }
    addPath( packageName, relativePath ) {
        this.obj.paths[packageName] = relativePath;
        this.write();
    }
    /**
     * Iterates through each temp packed package (used to denote nested packages installed to the root for packing)
     * @param {function} fn
     */
     forEachTempPacked( fn ) {
        var keys = Object.keys(this.obj.tempPacked);
        keys.forEach(key => {
            fn(key, this.obj.tempPacked[key]);
        });
    }
}

module.exports = LocalModulesRcController;