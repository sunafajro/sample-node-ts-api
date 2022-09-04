import { fromString } from "../../src/helpers/NumberHelper";

describe("Sum of two items", () => {
  test("String '2' without default value, should return 2", () => {
    expect(fromString('2')).toBe(2);
  });
  test("String '02' without default value, should return 2", () => {
    expect(fromString('02')).toBe(2);
  });
  test("String '02.02' without default value, should return 2", () => {
    expect(fromString('02.02')).toBe(2);
  });
  test("String 'a0202' with default of 2, should return 2", () => {
    expect(fromString('a0202', 2)).toBe(2);
  });
  test("String 'a0202' without default value, should return 0", () => {
    expect(fromString('a0202')).toBe(0);
  });
});
