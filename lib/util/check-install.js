const fs = require("fs");
const path = require("path");


/**
 * Checks whether the given directory has node_modules
 * @param {string} _dir
 */
module.exports = function checkInstall(_dir) {
    if(!fs.existsSync(_dir)) {
        return false;
    }
    if(fs.readdirSync(_dir).length === 0) {
        return false;
    }
    return true;
}