import { API_BASE, apiConfigured, safeArray, formatApiError } from "./api";

describe("API client configuration", () => {
  test("does not construct an invalid URL when backend configuration is absent", () => {
    expect(API_BASE).toBeNull();
    expect(apiConfigured).toBe(false);
  });
});

describe("API response helpers", () => {
  test("safeArray accepts arrays and rejects non-array payloads", () => {
    expect(safeArray([1, 2])).toEqual([1, 2]);
    expect(safeArray({ data: [] })).toEqual([]);
    expect(safeArray(null)).toEqual([]);
  });

  test("formatApiError handles server validation details", () => {
    expect(formatApiError("Invalid credentials")).toBe("Invalid credentials");
    expect(formatApiError([{ msg: "Field required" }])).toBe("Field required");
  });
});
