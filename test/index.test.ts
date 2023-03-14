import { app } from "../index";
const supertest = require("supertest-session");

describe("app", () => {
  it("says hello", async () => {
    const result = await supertest(app).get("/");
    expect(result.status).toBe(200);
    expect(result.text).toBe("hello world");
  });
});
