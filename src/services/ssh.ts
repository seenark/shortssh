import type { Dirent } from "node:fs"
import type { ReadDirError } from "./fs"
import { join } from "node:path"
import { Array, Effect, flow, Layer, pipe } from "effect"
import { FsContext } from "./fs"

function scanSshConfigRecur(readDirFn: (dir: string) => Effect.Effect<Dirent[], ReadDirError, never>) {
  return (dir: string): Effect.Effect<string[], ReadDirError> => {
    return pipe(
      readDirFn(dir),
      Effect.flatMap(Effect.forEach((d) => {
        const fulllpath = join(dir, d.name)
        if (d.isDirectory()) {
          return scanSshConfigRecur(readDirFn)(fulllpath)
          // .pipe(Effect.orElseSucceed(() => ([] as string[])))
        }
        if (d.name === "config")
          return Effect.succeed([fulllpath])
        return Effect.succeed([])
      }, { concurrency: "unbounded" })),
      Effect.map(Array.flatten),
      Effect.tap(() => Effect.withLogSpan(`scan dir: ${dir}`)),
    )
  }
}

export class SshConfigContext extends Effect.Service<SshConfigContext>()("services/SshConfig", {
  effect: Effect.all({
    fs: FsContext,
  }).pipe(
    Effect.map(({ fs }) => {
      return {
        /* return function here bcuz avoid requirements leak **/
        findSshConfig: flow(scanSshConfigRecur(fs.readDir)),
      }
    }),
  ),
  // dependencies: [FsContext.Default]
}) {

  static TestExample = Layer.succeed(this, {
    _tag: "services/SshConfig",
    findSshConfig: (_dirName: string) => Effect.succeed(["/base/config", "/base/dir1/config"])
  })

}
