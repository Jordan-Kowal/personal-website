import { describe, expect, test } from "bun:test";
import { HeroView, parseOpenParam } from "./utils";

describe("parseOpenParam", () => {
  test.each([
    { name: "no query", search: "", expected: undefined },
    { name: "trailer", search: "?open=trailer", expected: HeroView.Trailer },
    { name: "hobbies", search: "?open=hobbies", expected: HeroView.Hobbies },
    {
      name: "among other params",
      search: "?utm=gh&open=trailer",
      expected: HeroView.Trailer,
    },
    { name: "unknown view", search: "?open=skills", expected: undefined },
    { name: "wrong case", search: "?open=Trailer", expected: undefined },
    { name: "empty value", search: "?open=", expected: undefined },
    { name: "other param only", search: "?trailer", expected: undefined },
  ])("$name", ({ search, expected }) => {
    expect(parseOpenParam(search)).toBe(expected);
  });
});
