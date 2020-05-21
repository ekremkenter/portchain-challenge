import VesselService from "../../src/service/VesselService";
import { createSandbox } from "sinon";
import VesselController from "../../src/controller/VesselController";

const sandbox = createSandbox();

describe("VesselController Tests", function () {
  before(function () {});

  it("test sample data", async function () {
    sandbox
      .stub(VesselService, "getVessels")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require("../data/vessels.json"))
        )
      );
    sandbox
      .stub(VesselService, "getVesselSchedule")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require(`../data/schedule/0.json`))
        )
      );
    await VesselController.getData();
    sandbox.restore();
  });

  it("test2", async function () {
    sandbox
      .stub(VesselService, "getVessels")
      .resolves(
        VesselService.transformer(
          JSON.stringify(require("../data/vessels.json"))
        )
      );
    sandbox.stub(VesselService, "getVesselSchedule").callsFake((vesselImo) => {
      return VesselService.transformer(
        JSON.stringify(require(`../data/schedule/${vesselImo}.json`))
      );
    });
    await VesselController.getData();
    sandbox.restore();
  });
});
