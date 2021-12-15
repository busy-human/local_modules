/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */
// var fs = require('fs');
// var path = require('path');
var rimraf = require('rimraf');
// var exec = require('exe');

// var add = require('./add');
// var remove = require('./remove');
// const { forEachLocalModulePath, linkLocalToModuleSource } = require('../util/config-controller');
// const linkNode = require('./link-node');

module.exports = function clean(options) {
    rimraf.sync(options.dirPath);
};