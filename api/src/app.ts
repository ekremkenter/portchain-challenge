import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import VesselController from "./controller/VesselController";

const app = express();
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));

/*
In a typical prod environment, we should limit allowed origins,
but for the sake of this demo we will allow request from all domains
*/
app.use(cors());
// const allowedOrigins = [
//   "http://localhost:3000",
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (origin && allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

app.get("/", (_: Request, res: Response) => {
  res.json({
    success: true,
    data: { hello: "world!" }
  });
});

app.get("/data", async (req: Request, res: Response) => {
  try {
    const controller = new VesselController();
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
