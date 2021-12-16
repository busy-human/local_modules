var fs = require('fs');
var path = require('path');
const { linkLocalToModuleSource, forEachLocalModulePath } = require("../util/config-controller");
const linkNode = require('./link-node');

module.exports = function add(options) {
    forEachLocalModulePath(options, (name, _path) => {
        linkLocalToModuleSource(options, _path);
    });

    // Link the folders to node_modules
    linkNode(options);

    // add local modules
    options.modules.forEach(function (module) {
        var modulePath = path.join(options.dir, module);
        options.pkg.json.dependencies[module] = 'file:' + modulePath;
        console.log('add local dependency:', module, ':', 'file:' + modulePath);
    });

    // write modified package.json
    write(options);
};
