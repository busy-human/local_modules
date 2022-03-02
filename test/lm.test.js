const expect = require('chai').expect;
require('mocha-sinon')

const path = require('path');
const fs = require('fs');
const lpm = require('../index');
const fse = require('fs-extra');


describe('local_modules', function() {
    let version = require('../package.json').version;
    
    beforeEach(function() {
        this.sinon.stub(console, 'log');
    })
    afterEach(function() {
        console.log.restore();
    })

    it('should print version ' + version, () => {
        lpm({cmd: 'version'});
        expect(console.log.calledWith(version)).to.be.true;
    });
    it('should print help', () => {
        lpm({cmd: 'help'});
        expect(console.log.exception).to.be.undefined;
    })
});

describe('local_modules functionality', function() {
    before(function() {
        console.log("Creating temporary test directory");
        fse.copySync('examples', 'test-dir');
        process.chdir('test-dir/base_project');
    })
    after(function() {
        console.log("Deleting temporary test directory");
        process.chdir('../..');
        fse.rmSync('test-dir', { recursive: true });
    })

    afterEach(function(done) {
        this.timeout(0); // This is here as a breakpoint hack
        done();
    })

    it('should add local modules to the package.json', function(done) {
        lpm({cmd: 'add', addPath: '../package_foo' });
        Promise.resolve().then(() => {
            const added = parsePackageJson();
            expect(added.dependencies).to.have.property("package_foo");
            done();
        }).catch(() => {
            done(new Error("error when adding package"));
        })
    })

    it('should remove local modules from the package.json', function(done) {
        lpm({cmd: 'remove'});
        Promise.resolve().then(() => {
            const removed = parsePackageJson();
            expect(removed.dependencies).not.to.have.property("package_foo");
            done();
        })
    })

    it('should install local modules', function(done) {
        lpm({cmd: 'install'});
        Promise.resolve().then(() => {
            const result = parsePackageJson();
            expect(result.dependencies).to.have.property("package_foo");
            done();
        })
    })

    it('should uninstall local modules (does this actually do anything?)', function(done) {
        lpm({cmd: 'uninstall'});
        Promise.resolve().then(() => {
            done();
        });
    })

    it('should remove then link the dependencies into local_modules and link node_modules', function(done) {
        this.timeout(6000);
        lpm({cmd: 'remove'});
        Promise.resolve().then(() =>{
            lpm({cmd: 'link'});
            return Promise.resolve();
        }).then(() => {
            done();
        })
    })
})

function parsePackageJson() {
    var file = path.resolve('package.json');
    var packageJson = fs.readFileSync(file, 'utf8');
    return JSON.parse(packageJson);
}