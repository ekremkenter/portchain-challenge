import { render } from "@testing-library/react";
import React from "react";
import DataView from "../../views/DataView";
import { Data } from "../../api/models";

test("Render DataView", async () => {
  const data: Data = {
    portsWithMostArrivals: [{ port: "IST", count: 1 }],
    portsWithFewestPortCalls: [{ port: "ESB", count: 1 }],
    portCallDurations: [11, 22, 33, 44, 55],
    portDelayNthPercentiles: [5, 50, 80],
    portCallDurationNthPercentiles: [5, 50, 80],
    vesselPortCallDelays: [
      {
        vessel: {
          name: "test",
          imo: 1
        },
        when2: [1, 2, 3],
        when7: [4, 5, 6],
        when14: [7, 8, 9]
      }
    ]
  };

  const { getByText } = render(<DataView data={data} />);
  expect(getByText(/the most arrivals/)).toBeInTheDocument();
  for (let portCallDuration of data.portCallDurations) {
    expect(getByText(`${portCallDuration}mins`)).toBeInTheDocument();
  }

  for (let { vessel, when2, when7, when14 } of data.vesselPortCallDelays) {
    expect(getByText(vessel.name)).toBeInTheDocument();
    [when2, when7, when14].forEach(values => {
      values.forEach(value => {
        expect(getByText(`${value}h`)).toBeInTheDocument();
      });
    });
  }
});
