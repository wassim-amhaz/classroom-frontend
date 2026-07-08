import { describe, expect, it } from "vitest";
import { API_URL } from "./constants";

describe("API_URL (src/providerss/constants.ts)", () => {
  it("points to the expected fake REST API host", () => {
    expect(API_URL).toBe("https://api.fake-rest.refine.dev");
  });

  it("is a well-formed absolute URL", () => {
    expect(() => new URL(API_URL)).not.toThrow();
    expect(new URL(API_URL).protocol).toBe("https:");
  });
});