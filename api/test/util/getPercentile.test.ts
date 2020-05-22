import { expect } from "chai";
import { ascendingSort, getPercentile, getPercentiles } from "../../src/util";

describe("getPercentile Tests", function () {
  it("getPercentile", function () {
    expect(() => getPercentile([], 50)).to.throw;
    expect(() => getPercentile([1], 200)).to.throw;

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(getPercentile(numbers, 10)).to.eq(1.5);
    expect(getPercentile(numbers, 15)).to.eq(2);
    expect(getPercentile(numbers, 25)).to.eq(3);
    expect(getPercentile(numbers, 30)).to.eq(3.5);
    expect(getPercentile(numbers, 50)).to.eq(5.5);
    expect(getPercentile(numbers, 75)).to.eq(8);
    expect(getPercentile(numbers, 100)).to.eq(10);
    numbers = [1, 2, 3, 4, 2, 3, 4, 10, 5, 7, 8, 11].sort(ascendingSort);

    expect(getPercentile(numbers, 30)).to.eq(3);
    expect(getPercentile(numbers, 75)).to.eq(7.5);

    numbers = [5, 5.5, 4.5, 4.75, 5.35, 5.45, 6.15].sort(ascendingSort);
    expect(getPercentile(numbers, 75)).to.eq(5.5);
  });

  it("getPercentiles", function () {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(getPercentiles(numbers, [10, 15])).to.deep.eq([1.5, 2]);
  });
});
