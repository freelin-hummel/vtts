import { describe, expect, it } from "vitest";

import { err, ok } from "../src/index.js";

describe("shared utilities", () => {
  it("ok wraps a value in a success result", () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it("err wraps an error in a failure result", () => {
    const result = err(new Error("boom"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("boom");
    }
  });
});
