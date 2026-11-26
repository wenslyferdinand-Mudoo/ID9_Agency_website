import { formatApiError, safeArray } from "./api";

describe("safeArray", () => {
  it("preserves array responses", () => {
    const value = [{ id: 1 }, { id: 2 }];
    expect(safeArray(value)).toBe(value);
  });

  it.each([null, undefined, "unexpected", 42, { data: [] }])(
    "returns an empty array for non-array input: %p",
    (value) => {
      expect(safeArray(value)).toEqual([]);
    }
  );
});

describe("formatApiError", () => {
  it("returns a safe fallback for empty errors", () => {
    expect(formatApiError(null)).toBe("Something went wrong. Please try again.");
    expect(formatApiError(undefined)).toBe("Something went wrong. Please try again.");
  });

  it("preserves a string error message", () => {
    expect(formatApiError("Request rejected")).toBe("Request rejected");
  });

  it("formats validation error arrays without losing messages", () => {
    expect(
      formatApiError([{ msg: "Invalid email" }, { code: "required" }])
    ).toBe('Invalid email {"code":"required"}');
  });

  it("uses a message property when available", () => {
    expect(formatApiError({ msg: "Access denied" })).toBe("Access denied");
  });

  it("stringifies unexpected primitive errors", () => {
    expect(formatApiError(503)).toBe("503");
  });
});


describe("API_BASE", () => {
  const previousApiUrl = process.env.REACT_APP_API_URL;
  const previousBackendUrl = process.env.REACT_APP_BACKEND_URL;

  afterEach(() => {
    if (previousApiUrl === undefined) delete process.env.REACT_APP_API_URL;
    else process.env.REACT_APP_API_URL = previousApiUrl;
    if (previousBackendUrl === undefined) delete process.env.REACT_APP_BACKEND_URL;
    else process.env.REACT_APP_BACKEND_URL = previousBackendUrl;
    jest.resetModules();
  });

  it.each([
    [" https://api.example.com/api/ ", "", "https://api.example.com/api"],
    ["", "https://backend.example.com/", "https://backend.example.com/api"],
    ["", "", null],
  ])("normalizes configured backend URLs", (apiUrl, backendUrl, expected) => {
    process.env.REACT_APP_API_URL = apiUrl;
    process.env.REACT_APP_BACKEND_URL = backendUrl;
    jest.resetModules();

    const { API_BASE } = require("./api");

    expect(API_BASE).toBe(expected);
  });
});
