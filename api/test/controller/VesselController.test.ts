import VesselService from "../../src/service/VesselService";
import { createSandbox } from "sinon";
import VesselController from "../../src/controller/VesselController";
import { expect } from "chai";

const sandbox = createSandbox();

describe("VesselController Tests", function() {
  before(function() {
    this.controller = new VesselController(new VesselService("test"));
  });

  it("getData", async function() {
    sandbox.stub(VesselService.prototype, "getVessels").resolves([
      {
        imo: 0,
        name: "test"
      }
    ]);
    sandbox
      .stub(VesselService.prototype, "getVesselSchedule")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require(`../data/schedule/0.json`))
        )
      );
    const data = await this.controller.getData();

    expect(data).to.exist;
    expect(data).to.haveOwnProperty("portDelayNthPercentiles");
    expect(data).to.haveOwnProperty("portCallDurationNthPercentiles");
    expect(data).to.haveOwnProperty("vesselPortCallDelays");
    expect(data).to.haveOwnProperty("portCallDurations");
    expect(data).to.haveOwnProperty("portsWithMostArrivals");
    expect(data).to.haveOwnProperty("portsWithFewestPortCalls");

    expect(data.portDelayNthPercentiles).to.deep.eq([5, 50, 80]);
    expect(data.portCallDurationNthPercentiles).to.deep.eq([5, 20, 50, 75, 90]);

    expect(data.portCallDurations).to.deep.equal([60, 60, 150, 240, 240]);
    expect(data.portsWithMostArrivals).deep.eq([
      { port: "Djibouti", count: 2 }
    ]);
    expect(data.portsWithFewestPortCalls).to.deep.eq([
      { port: "Test", count: 1 },
      { port: "Djibouti", count: 2 }
    ]);

    expect(data.vesselPortCallDelays).to.deep.eq([
      {
        vessel: { imo: 0, name: "test" },
        when2: [3, 15, 27],
        when7: [5, 12, 19],
        when14: [5, 12, 19]
      }
    ]);

    sandbox.restore();
  });
});
