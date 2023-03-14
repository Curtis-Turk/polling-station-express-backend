"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const supertest = require("supertest-session");
// import mockAxios from "jest-mock-axios";
const pollingDataExists_1 = require("./mockApiResponses/pollingDataExists");
const addressPickerResponse_1 = require("./mockApiResponses/addressPickerResponse");
const axios_1 = __importDefault(require("axios"));
// Mock jest and set the type
jest.mock("axios");
const mockedAxiosGet = axios_1.default.get;
// afterEach(() => {
//   // cleaning up the mess left behind the previous test
//   mockAxios.reset();
// });
describe("app", () => {
    it("says hello", async () => {
        const result = await supertest(index_1.app).get("/");
        expect(result.status).toBe(200);
        expect(result.text).toBe("hello world");
    });
    it("verifies the postcode", async () => {
        const postcodeRequest = { postcode: "TN4TWH" };
        mockedAxiosGet.mockResolvedValueOnce({ data: pollingDataExists_1.pollingDataExistsResponse });
        const result = await supertest(index_1.app)
            .post("/postcode")
            .set("origin", process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: true,
            pollingStations: [],
        });
    });
    it("returns several addresses", async () => {
        const postcodeRequest = { postcode: "TN4TWH" };
        mockedAxiosGet.mockResolvedValueOnce({ data: addressPickerResponse_1.addressPickerResponse });
        const result = await supertest(index_1.app)
            .post("/postcode")
            .set("origin", process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: false,
            pollingStations: [
                {
                    address: "16 DUNCAN CLOSE, ST. MELLONS, CARDIFF",
                    postcode: "CF3 1NP",
                    slug: "100100106448",
                    url: "http://developers.democracyclub.org.uk/api/v1address/100100106448",
                },
                {
                    address: "26 DUNCAN CLOSE, ST. MELLONS, CARDIFF",
                    postcode: "CF3 1NP",
                    slug: "100100106458",
                    url: "http://developers.democracyclub.org.uk/api/v1address/100100106458",
                },
            ],
        });
    });
    it("returns a 400 status with incorrect origin", async () => {
        const postcodeRequest = { postcode: "TN4TWH" };
        await supertest(index_1.app).post("/postcode").send(postcodeRequest).expect(400);
    });
});
