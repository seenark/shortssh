import { fileURLToPath } from "node:url"
import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  /*
    alias should match alias in tsconfig
    this setting will tell rollup how to resolve paths
  */
  alias: {
    "@": fileURLToPath(new URL("./src/", import.meta.url)),
  },
  clean: true,
  entries: ["src/index.ts"],
  rollup: {
    esbuild: {
      minify: true,
      target: "node22",
    },
    inlineDependencies: true,
  },
})
