var fs = require('fs');
var path = require('path');
const { forEachLocalModulePath } = require("../util/config-controller");
const Packages = require('../util/packages');
const linkNode = require('./link-node');

module.exports = function add(options) {
    forEachLocalModulePath(options, (name, _path) => {
        Packages.root.local_modules.linkLocalToModuleSource(_path);
    });

    // Link the folders to node_modules
    linkNode(options);

    // add local modules
    options.modules.forEach(function (module) {
        var modulePath = path.join(options.dir, module);
        Packages.root.json.dependencies[module] = 'file:./' + modulePath;
        console.log('add local dependency:', module, ':', 'file:./' + modulePath);
    });

    // write modified package.json
    Packages.root.json.write();
};
