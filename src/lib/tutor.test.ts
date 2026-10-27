import { describe, expect, it } from "vitest";
import {
  DEFAULT_TUTOR_SETTINGS,
  parseTutorSettings,
} from "./tutor";

describe("tutor settings", () => {
  it("returns defaults for malformed input", () => {
    expect(parseTutorSettings("")).toEqual(DEFAULT_TUTOR_SETTINGS);
    expect(parseTutorSettings("nope")).toEqual(DEFAULT_TUTOR_SETTINGS);
  });

  it("merges partial settings with defaults", () => {
    const parsed = parseTutorSettings(
      JSON.stringify({ model: "custom-model", apiKey: "sk-local" })
    );
    expect(parsed.baseUrl).toBe(DEFAULT_TUTOR_SETTINGS.baseUrl);
    expect(parsed.model).toBe("custom-model");
    expect(parsed.apiKey).toBe("sk-local");
  });
});
