export type { JsonValue } from "@vtts/content-schema";

/** Branded ID type for workspace-scoped identifiers. */
export type PackageId = string & { readonly __brand: "PackageId" };
export type GlobalId = string & { readonly __brand: "GlobalId" };
export type LocalId = string & { readonly __brand: "LocalId" };

/** Minimal result wrapper used across package boundaries. */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
