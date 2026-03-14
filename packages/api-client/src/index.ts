export type { JsonValue, PackageId, GlobalId, LocalId, Result } from "@vtts/shared";

/** Base URL used when constructing API requests. Override in tests or config. */
export const API_BASE_URL = "/api";

/** Typed route constants for the vtts HTTP API. */
export const routes = {
  imports: `${API_BASE_URL}/imports`,
  packages: `${API_BASE_URL}/packages`,
  assets: `${API_BASE_URL}/assets`,
  scenes: `${API_BASE_URL}/scenes`,
} as const;
