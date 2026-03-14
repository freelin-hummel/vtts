import { describe, expect, it } from "vitest";

import { routes } from "@vtts/api-client";

describe("web app bootstrap", () => {
  it("imports api-client routes through workspace package", () => {
    expect(routes.packages).toBe("/api/packages");
    expect(routes.scenes).toBe("/api/scenes");
  });
});
