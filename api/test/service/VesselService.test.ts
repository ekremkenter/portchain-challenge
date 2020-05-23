import VesselService from "../../src/service/VesselService";
import { expect } from "chai";
import { createSandbox } from "sinon";
import moment from "moment";

const sandbox = createSandbox();

describe("VesselService Tests", function() {
  before(function() {
    this.service = new VesselService("testUrl");
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
  });

  it("vessel service should be initialized with baseURL", function() {
    expect(() => new VesselService("")).to.throw;
  });

  it("getVessels", async function() {
    const vessels = await this.service.getVessels();
    expect(vessels).to.exist;
    expect(vessels).to.have.length(1);
    expect(vessels[0].imo).to.eq(0);
    expect(vessels[0].name).to.eq("test");
  });

  it("getVesselSchedule", async function() {
    const vesselImo = 0;
    const scheduleResponse = await this.service.getVesselSchedule(vesselImo);
    expect(scheduleResponse).to.exist;
    expect(scheduleResponse.vessel).to.exist;
    expect(scheduleResponse.vessel.imo).to.eq(vesselImo);
    expect(scheduleResponse.portCalls).to.exist;
    expect(scheduleResponse.portCalls).to.have.length(3);
    expect(scheduleResponse.portCalls[0].arrival).to.deep.eq(
      moment("2019-03-15T13:00:00+00:00")
    );
    expect(scheduleResponse.portCalls[0].port.id).to.eq("DJPOD");
    expect(scheduleResponse.portCalls[0].logEntries).to.have.length(3);
    expect(scheduleResponse.portCalls[0].logEntries[0].createdDate).to.deep.eq(
      moment("2019-03-01T00:00:00+00:00")
    );
  });
});
