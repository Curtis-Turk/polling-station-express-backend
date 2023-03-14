"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const supertest = require("supertest-session");
const jest_mock_axios_1 = __importDefault(require("jest-mock-axios"));
const pollingDataExists_1 = require("./mockApiResponses/pollingDataExists");
afterEach(() => {
    // cleaning up the mess left behind the previous test
    jest_mock_axios_1.default.reset();
});
describe("app", () => {
    it("says hello", async () => {
        const result = await supertest(index_1.app).get("/");
        expect(result.status).toBe(200);
        expect(result.text).toBe("hello world");
    });
    it("verifies the postcode", async () => {
        const postcodeRequest = "TN4 TWH";
        jest_mock_axios_1.default.mockResponse({ data: pollingDataExists_1.pollingDataExistsResponse });
        const result = await supertest(index_1.app).get("/postcode").send(postcodeRequest);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: true,
            pollingStations: [],
        });
    });
});
