import type { Dirent } from "node:fs"
import fs from "node:fs/promises"
import { Effect } from "effect"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { readDir } from "./fs"

vi.mock("node:fs/promises")

describe("fs service", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should successfully read directory contents", async () => {
    // Arrange
    const mockDirents = [
      { isFile: () => true, name: "file1.txt" } as Dirent,
      { isDirectory: () => true, name: "dir1" } as Dirent,
    ]
    vi.mocked(fs.readdir).mockResolvedValue(mockDirents)
    const testDir = "/test/dir"

    // Act
    const result = await Effect.runPromise(readDir(testDir))

    // Assert
    expect(result).toEqual(mockDirents)
    expect(fs.readdir).toHaveBeenCalledWith(testDir, { withFileTypes: true })
    expect(fs.readdir).toHaveBeenCalledTimes(1)
  })

  it("should return ReadDirError when fs.readdir fails", async () => {
    // Arrange
    const testDir = "/test/dir"
    const fsError = new Error("Failed to read directory")
    vi.mocked(fs.readdir).mockRejectedValue(fsError)

    // Act
    const program = readDir(testDir)

    // Assert
    await expect(Effect.runPromise(program)).rejects.toMatchSnapshot()
    expect(fs.readdir).toHaveBeenCalledWith(testDir, { withFileTypes: true })
    expect(fs.readdir).toHaveBeenCalledTimes(1)
  })
})
