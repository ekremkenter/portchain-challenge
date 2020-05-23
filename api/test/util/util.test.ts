import { expect } from "chai";
import {
  ascendingSort,
  getPercentile,
  getPercentiles,
  getPortCallDelays,
  sortAndGetTopN
} from "../../src/util";
import moment from "moment";
import { Delays } from "../../src/models";

describe("util tests", function() {
  it("getPercentile", function() {
    expect(getPercentile.bind(null, [], 50)).to.throw;
    expect(getPercentile.bind(null, [1], 200)).to.throw;

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

  it("getPercentiles", function() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(getPercentiles(numbers, [10, 15])).to.deep.eq([1.5, 2]);
  });

  it("test ascendingSort", function() {
    expect(ascendingSort(5, 6)).to.eq(-1);
    expect(ascendingSort(10, 6)).to.eq(4);
    expect(ascendingSort(11, 11)).to.eq(0);

    expect([5, 11, 10, 6].sort(ascendingSort)).to.deep.eq([5, 6, 10, 11]);
  });

  it("test getPortCallDelays", function() {
    expect(
      getPortCallDelays(
        [
          {
            updatedField: "arrival",
            arrival: moment("2019-03-15T18:00:00+00:00"),
            createdDate: moment("2019-03-01T00:00:00+00:00")
          },
          {
            updatedField: "arrival",
            arrival: moment("2019-03-15T10:00:00+00:00"),
            createdDate: moment("2019-03-13T12:59:00+00:00")
          },
          {
            updatedField: "arrival",
            arrival: moment("2019-03-15T13:00:00+00:00"),
            createdDate: moment("2019-03-15T13:00:00+00:00")
          }
        ],
        moment("2019-03-15T13:00:00+00:00")
      )
    ).to.deep.eq({
      delay2Days: 3,
      delay7Days: 5,
      delay14Days: 5
    } as Delays);
  });

  it("test sortAndGetTopN", function() {
    let map = new Map([["A", 1], ["B", 1], ["T", 2]]);
    expect(sortAndGetTopN(map, 1, "asc")).to.deep.eq([
      {
        port: "A",
        count: 1
      }
    ]);

    expect(sortAndGetTopN(map, 2, "desc")).to.deep.eq([
      {
        port: "T",
        count: 2
      },
      {
        port: "A",
        count: 1
      }
    ]);

    expect(sortAndGetTopN(map, 4, "desc")).to.deep.eq([
      {
        port: "T",
        count: 2
      },
      {
        port: "A",
        count: 1
      },
      {
        port: "B",
        count: 1
      }
    ]);
  });
});
