import * as fs from "node:fs/promises"
import { ErrorHelpers } from "@/helpers"
import { Data, Effect } from "effect"

export class ReadDirError extends Data.TaggedError("fs/ReadDirError")<ErrorHelpers.ErrorMsg> {
  static new = ErrorHelpers.createErrorFactory(this)
}

export function readDir(dir: string) {
  return Effect.tryPromise({
    catch: ReadDirError.new(),
    try: () => fs.readdir(dir, { withFileTypes: true }),
  })
}

export class FsContext extends Effect.Service<FsContext>()("services/Fs", {
  succeed: {
    readDir,
  },
}) { }
