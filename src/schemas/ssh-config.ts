import * as S from "effect/Schema"
import * as Helpers from "./helpers"

export const Schema = S.Struct({
  _tag: S.Literal("SSHConfig").pipe(S.optional, S.withDefaults({
    constructor: () => "SSHConfig" as const,
    decoding: () => "SSHConfig" as const,
  })),
  host: S.String,
  hostName: S.String,
  identityFile: S.String,
  strictHostKeyChecking: S.Boolean,
  user: S.String,
})

export type SSHConfig = typeof Schema.Type
export type SSHConfigEncoded = typeof Schema.Encoded

export const convertEffect = Helpers.convertEffect(Schema)
export const convertSync = Helpers.convertSync(Schema)

export const Array = S.Array(Schema)

export type SSHConfigArray = typeof Array.Type
export type SSHConfigEncodedArray = typeof Array.Encoded

export const convertArrayEffect = Helpers.convertEffect(Schema)
export const convertArraySync = Helpers.convertSync(Schema)
