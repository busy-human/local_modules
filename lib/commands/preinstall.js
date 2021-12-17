const install = require("./install.js");

module.exports = function preinstall(options) {
    return install(options);
};
