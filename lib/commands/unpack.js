var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, forEachLocalModulePath } = require("../util/config-controller");
const Packages = require('../util/packages');
const install = require("./install");
const clean = require("./clean");

module.exports = function unpack(options) {
    clean(options);
    Packages.root.json.removeTemporaryModules();
    Packages.root.rc.forgetPackedRecords();

    install(options);
};
