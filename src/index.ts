#!/usr/bin/env node
/*
 *   Copyright (c) 2022 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */

/**
 * module dependencies
 */
//  var fs = require('fs');
//  var path = require('path');
//  var defaults = require('defaults');

//  var c = require('./config');
//  const PackageController = require('./lib/util/package-controller.js');
//  const Globals = require('./lib/util/globals');
//  const Packages = require("./lib/util/packages.js");
// import PackageController from "./lib/util/package-controller";
// import Packages from "./lib/util/packages";
// import { Logger }  from "./lib/util/logger";
//  const { Logger } = require('./lib/util/logger');
//  const checkInstall = require("./lib/util/check-install.js");
//  const { install } = require('./lib/util/package-manager-control');
//  const yargs = require("yargs");
import yargs from "yargs";
// Packages.controllerClass = PackageController;

import cmd_version from "./lib/commands/version";

yargs
    .command( cmd_version )
    .argv;