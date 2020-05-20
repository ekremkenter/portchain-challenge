import VesselService from "../../src/service/VesselService";
import { expect } from "chai";

describe("VesselService Tests", function() {

  before(function() {
    VesselService.init();
  });

  it("getVessels", async function() {
    const vessels = await VesselService.getVessels();
    expect(vessels).to.exist;
    expect(vessels).to.have.length.above(1);
    expect(vessels[0]).to.haveOwnProperty("imo");
    expect(vessels[0]).to.haveOwnProperty("name");
  });

  it("getVesselSchedule", async function() {
    const vesselImo = 9757187;
    const scheduleResponse = await VesselService.getVesselSchedule(vesselImo);
    expect(scheduleResponse).to.exist;
    expect(scheduleResponse.vessel).to.exist;
    expect(scheduleResponse.vessel.imo).to.eq(vesselImo);
    expect(scheduleResponse.portCalls).to.exist;
    expect(scheduleResponse.portCalls).to.have.length.above(1);
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("arrival");
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("port");
    expect(scheduleResponse.portCalls[0]).to.haveOwnProperty("logEntries");
    console.log(scheduleResponse.portCalls[0].createdDate.format("DD MM YYYY"));
  });

});