import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.post("/postcode", (req: Request, res: Response) => {
  const result: any = {
    pollingStationFound: true,
    pollingStations: [
      {
        address: "123 Privet Drive, London",
        postcode: "W12 LKW",
        slug: "12345",
      },
      {
        address: "124 dawn road, London",
        postcode: "W13 LLW",
        slug: "67890",
      },
    ],
  };
  return res.json(result);
});

app.post("/submit", (req: Request, res: Response) => {
  console.log(req.body);
  return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
