import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.post("/submit", (req: Request, res: Response) => {
  // res.send("hello world");
  // res.status(whatever).json(json goes here)
  return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
