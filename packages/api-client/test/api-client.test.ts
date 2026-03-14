import { describe, expect, it } from "vitest";

import { routes } from "../src/index.js";

describe("api-client routes", () => {
  it("exposes expected route constants", () => {
    expect(routes.imports).toBe("/api/imports");
    expect(routes.packages).toBe("/api/packages");
    expect(routes.assets).toBe("/api/assets");
    expect(routes.scenes).toBe("/api/scenes");
  });
});
