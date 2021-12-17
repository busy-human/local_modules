var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, forEachLocalModulePath } = require("../util/config-controller");
const Packages = require('../util/packages');
const install = require("./install");
const clean = require("./clean");

module.exports = function unpack(options) {
    clean(options);
    Packages.root.json.removeTemporaryModules();
    Packages.root.json.forgetPackedRecords();
    Packages.root.json.write();

    install(options);

    // write modified package.json
    Packages.root.json.write();
};
