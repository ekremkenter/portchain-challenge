import VesselService from "../../src/service/VesselService";
import { expect } from "chai";

describe("VesselService Tests", function() {
  before(function() {
    this.service = new VesselService(
      "https://import-coding-challenge-api.portchain.com/api/v2"
    );
  });

  it("getVessels", async function() {
    const vessels = await this.service.getVessels();
    expect(vessels).to.exist;
    expect(vessels).to.have.length.above(1);
    expect(vessels[0]).to.haveOwnProperty("imo");
    expect(vessels[0]).to.haveOwnProperty("name");
  });

  it("getVesselSchedule", async function() {
    const vesselImo = 9757187;
    const scheduleResponse = await this.service.getVesselSchedule(vesselImo);
    expect(scheduleResponse).to.exist;
    expect(scheduleResponse.vessel).to.exist;
    expect(scheduleResponse.vessel.imo).to.eq(vesselImo);
    expect(scheduleResponse.portCalls).to.exist;
    expect(scheduleResponse.portCalls).to.have.length.above(1);
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("arrival");
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("port");
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("logEntries");
  });
});
