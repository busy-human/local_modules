import yargs from "yargs";
import fs from "fs";
import path from "path";

export default {
  command: "version",
  describe: "Show the current package version",
  handler: function(argv) {
    // @ts-ignore
    const str = fs.readFileSync(path.join(__dirname, "../../../package.json"), "utf8");;
    const pkg = JSON.parse(str);

    console.log(`${pkg.name} ${pkg.version}`);
  }
} as yargs.CommandModule;

