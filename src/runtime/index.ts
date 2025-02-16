import { FsContext } from "@/services/fs"
import { SshConfigContext } from "@/services/ssh"
import { Layer, ManagedRuntime } from "effect"

const MainLive = Layer.mergeAll(
  SshConfigContext.Default
)

export const MainRuntime = ManagedRuntime.make(MainLive)
