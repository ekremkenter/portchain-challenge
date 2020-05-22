import VesselService from "../../src/service/VesselService";
import { createSandbox } from "sinon";
import VesselController from "../../src/controller/VesselController";

const sandbox = createSandbox();

describe("VesselController Tests", function() {
  before(function() {
    this.controller = new VesselController(
      "https://import-coding-challenge-api.portchain.com/api/v2"
    );
  });

  it("test sample data", async function() {
    sandbox
      .stub(VesselService.prototype, "getVessels")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require("../data/vessels.json"))
        )
      );
    sandbox
      .stub(VesselService.prototype, "getVesselSchedule")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require(`../data/schedule/0.json`))
        )
      );
    await this.controller.getData();
    sandbox.restore();
  });

  it("test2", async function() {
    sandbox
      .stub(VesselService.prototype, "getVessels")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require("../data/vessels.json"))
        )
      );
    sandbox
      .stub(VesselService.prototype, "getVesselSchedule")
      .callsFake(vesselImo => {
        return VesselService.transformer(
          JSON.stringify(require(`../data/schedule/${vesselImo}.json`))
        );
      });
    await this.controller.getData();
    sandbox.restore();
  });
});
