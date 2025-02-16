

import { Effect, Layer, ManagedRuntime } from "effect"
import { Dirent } from "node:fs"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FsContext, type ReadDirError } from "./fs"
import { SshConfigContext } from "./ssh"
import { join } from "node:path"



// // Helper function to create mock Dirent objects
const createMockDirent = (name: string, isDir: boolean): Dirent => ({
  name,
  isDirectory: () => isDir,
  isFile: () => !isDir,
  isBlockDevice: () => false,
  isCharacterDevice: () => false,
  isFIFO: () => false,
  isSocket: () => false,
  isSymbolicLink: () => false,
  parentPath: "",
  path: ""
})

describe("ssh config", () => {


  it('should find config files in a simple directory structure', async () => {
    // Arrange
    const fsContextTest = FsContext.make({
      readDir: vi.fn((dir: string) => {
        if (dir === "/base") {
          return Effect.succeed([
            createMockDirent("config", false),
            createMockDirent("dir1", true),
          ])
        }
        if (dir === "/base/dir1") {
          return Effect.succeed([
            createMockDirent("config", false),
          ])
        }
        return Effect.succeed([])
      })
    })

    const program = SshConfigContext.pipe(
      Effect.flatMap((ctx) => ctx.findSshConfig("/base")),
      Effect.provide(
        SshConfigContext.Default.pipe(
          Layer.provide(Layer.succeed(
            FsContext, fsContextTest,
          ))
        )
      ),
    )

    // Act

    const result = await Effect.runPromise(program).catch(console.error)

    // const result = await Effect.runPromise(
    //   pipe(
    //     Effect.flatMap(
    //       sshConfigLayer,
    //       (context) => context.findSshConfig('/base')
    //     )
    //   )
    // )

    // Assert
    expect(result).toEqual(["/base/config", "/base/dir1/config"])
    expect(fsContextTest.readDir).toHaveBeenCalledWith('/base')
    expect(fsContextTest.readDir).toHaveBeenCalledWith('/base/dir1')
  })




})
