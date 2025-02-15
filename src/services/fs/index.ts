import * as fs from "node:fs/promises"
import { join } from "node:path"
import { ErrorHelpers } from "@/helpers"
import { Array, Data, Effect } from "effect"

class ReadDirError extends Data.TaggedError("fs/ReadDirError")<ErrorHelpers.ErrorMsg> {
  static new = ErrorHelpers.createErrorFactory(this)
}

function readDir(dir: string) {
  return Effect.tryPromise({
    catch: ReadDirError.new(),
    try: () => fs.readdir(dir, { withFileTypes: true }),
  })
}

function scanSshConfig(dir: string): Effect.Effect<string[], ReadDirError> {
  return readDir(dir).pipe(
    Effect.flatMap(Effect.forEach((d) => {
      const fulllpath = join(dir, d.name)
      if (d.isDirectory())
        return scanSshConfig(fulllpath)
      if (d.name === "config")
        return Effect.succeed([fulllpath])
      return Effect.succeed([])
    }, { concurrency: "unbounded" })),
    Effect.map(Array.flatten),
    Effect.map(d => d),
  )
}

export function findSshConfigs(baseDir: string) {
  return scanSshConfig(baseDir)
}
