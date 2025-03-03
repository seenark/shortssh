import * as os from "node:os"
import { Effect } from "effect"

async function main() {
  const home = os.homedir()

  const program = findSshConfigs(`${home}/.private-key/private-key`)

  const data = await Effect.runPromise(program)
  console.log({ data })
}

main().catch(console.error)
