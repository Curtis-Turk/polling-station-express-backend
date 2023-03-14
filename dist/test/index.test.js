"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const supertest = require("supertest-session");
describe("app", () => {
    it("says hello", async () => {
        const result = await supertest(index_1.app).get("/");
        expect(result.status).toBe(200);
        expect(result.text).toBe("hello world");
    });
});
