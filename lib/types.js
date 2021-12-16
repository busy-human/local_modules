/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */


/**
 * @typedef {object} PackageDependencies
 */

/**
 * @typedef {object} PackageLocalModuleConfig
 * @property {object} paths
 * @property {object} packed
 */

/**
 * @typedef {object} PackageJson
 * @property {string} name
 * @property {string} version
 * @property {PackageDependencies} dependencies
 * @property {PackageLocalModuleConfig} local_modules
 */

/**
 * @typedef {object} GlobalCommandOptions
 * @property {string} cmd
 * @property {string} force
 * @property {string[]} modules
 * @property {string} dirPath
 * @property {string} packagePath
 * @property {import('./util/package-json-controller.js')} pkg
 */

/**
 * @typedef {object} LocalModuleDefinition
 * @property {string} fullPath
 * @property {PackageJson} package
 * @property {string} relativePath
 */

module.exports = {};