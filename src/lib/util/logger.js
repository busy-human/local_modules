/*
 *   Copyright (c) 2021 Busy Human LLC
 *   All rights reserved.
 *   This file, its contents, concepts, methods, behavior, and operation  (collectively the "Software") are protected by trade secret, patent,  and copyright laws. The use of the Software is governed by a license  agreement. Disclosure of the Software to third parties, in any form,  in whole or in part, is expressly prohibited except as authorized by the license agreement.
 */

class Logger {
    constructor() {
        this.commandPrefix = "";
        this.prefix = "";
    }
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    setCommandPrefix(prefix) {
        this.commandPrefix = prefix;
    }
    resolvePrefix() {
        if(this.prefix) {
            return `lpm ${this.commandPrefix} [${this.prefix}] `;
        } else {
            return `lpm ${this.commandPrefix} `;
        }
    }
    log(...args) {
        console.log(this.resolvePrefix(), ...args);
    }
    warn(...args) {
        console.warn(this.resolvePrefix(), ...args);
    }
}

module.exports.Logger = new Logger();