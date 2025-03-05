// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
   entryPoints: ["./mod.ts"],
   outDir: "./npm",
   shims: {
      // see JS docs for overview and more options
      deno: true,
   },
   package: {
      "name": "exist-sdk-typescript",
      "version": Deno.args[0],
      "description": "Zero-dependency typescript wrapper for authenticating and querying the exist.io API.",
      "repository": {
         "type": "git",
         "url": "git+https://github.com/leonschreiber96/exist-sdk-typescript.git"
      },
      "author": "Leon Schreiber <mail@leonschreiber.in-berlin.de>",
      "license": "GPL-3.0",
      "bugs": {
         "url": "https://github.com/leonschreiber96/exist-sdk-typescript/issues"
      },
      "homepage": "https://github.com/leonschreiber96/exist-sdk-typescript#readme"
   },
   postBuild() {
      // steps to run after building and before running the tests
      Deno.copyFileSync("LICENSE", "npm/LICENSE");
      Deno.copyFileSync("README.md", "npm/README.md");
      Deno.removeSync("npm/src/src/authorization/existAuthorizer.ts");
   },
});