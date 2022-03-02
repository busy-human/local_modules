var fs = require('fs');
const Packages = require('../util/packages');

module.exports = function remove(options) {
    options.modules.forEach(function(module) {
      delete Packages.root.json.dependencies[module];
      console.log('remove local dependency:', module);
    });
    Packages.root.json.write();
};
