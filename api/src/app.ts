import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import VesselController from "./controller/VesselController";
import { VesselService } from "./service";

const app = express();
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));

// TODO add your custom domain to here
const allowedOrigins = [
  "http://localhost:3000",
  "https://portchain-challenge.mek.app"
];
app.use(
  cors({
    origin(origin, callback) {
      if (origin && allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.get("/", (_: Request, res: Response) => {
  res.json({
    success: true,
    data: { hello: "world!" }
  });
});

const baseUrl = "https://import-coding-challenge-api.portchain.com/api/v2";
app.get("/data", async (_: Request, res: Response) => {
  try {
    const controller = new VesselController(new VesselService(baseUrl));
    const data = await controller.getData();
    res.json({
      success: true,
      data
    });
  } catch (e) {
    res.json({
      success: false,
      message: e.toString()
    });
  }
});

export default app;
