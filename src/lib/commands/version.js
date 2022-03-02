"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = {
    command: "version",
    handler: function (argv) {
        // @ts-ignore
        const str = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../package.json"), "utf8");
        ;
        const pkg = JSON.parse(str);
        const version = pkg.version;
        console.log(version);
    }
};
//# sourceMappingURL=version.js.map