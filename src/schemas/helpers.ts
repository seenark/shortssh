import * as S from "effect/Schema"

export function convertEffect<A, I, R = never>(schema: S.Schema<A, I, R>) {
  return {
    objectToSchema: S.decode(schema),
    schemaToObject: S.encode(schema),
  }
}

export function convertSync<A, I>(schema: S.Schema<A, I, never>) {
  return {
    objectToSchema: S.decodeUnknownSync(schema),
    schemaToObject: S.encodeSync(schema),
  }
}
