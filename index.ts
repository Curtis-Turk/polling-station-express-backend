import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ElectoralCommisionApi } from "./api/electoralCommisionApi";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

const electoralCommission = new ElectoralCommisionApi(
  process.env.EC_API_KEY as string
);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.post("/postcode", async (req: Request, res: Response) => {
  if (req.headers.origin !== process.env.FRONT_END_DOMAIN) res.sendStatus(400);
  console.log("hello");
  console.log(req.body);
  const pollingStationResponse = await electoralCommission.verifyPostcode(
    req.body.postcode
  );
  return res.json(pollingStationResponse);
});

app.post("/submit", (req: Request, res: Response) => {
  console.log(req.body);
  return res.sendStatus(204);
});

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
