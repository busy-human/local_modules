var fs = require('fs');
var path = require('path');
const Packages = require('../util/packages');
const install = require("./install");
const clean = require("./clean");
var uninstall = require("./uninstall");

module.exports = function unpack(options) {
    uninstall(options);
    clean(options);
    Packages.root.json.removeTemporaryModules();
    Packages.root.rc.forgetPackedRecords();

    install(options);
};
