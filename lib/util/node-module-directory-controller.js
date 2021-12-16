class NodeModuleDirectoryController {
    /**
     *
     * @param {import("./package-controller.js")} controller
     */
    constructor(controller) {
        this.pkg = controller;
    }
    /**
     * Ensures the scope folder exists for the given scope (if any)
     * @param {string} packageName
     */
     coerceScopedModulePath(packageName) {
        var moduleScope = this.pkg.paths.resolveModuleScope(packageName);
        if(moduleScope) {
            var moduleScopePath = path.resolve(this.pkg.paths.node_modules, moduleScope);
            if(!fs.existsSync(moduleScopePath)) {
                fs.mkdirSync(moduleScopePath);
            }
        }
    }

    /**
     * Cleans up any existing copy or link of the local module in the node_modules directory
     * @param {string} packageName
     */
    clean(packageName) {
        var symlinkPath = path.resolve(this.pkg.paths.node_modules, packageName);
        try {
            fs.unlinkSync(symlinkPath);
        } catch(err) {

        }
        if(fs.existsSync(symlinkPath)) {
            rimraf.sync(symlinkPath);
        }
    }
}

module.exports = NodeModuleDirectoryController;