import { app } from "../index";
const supertest = require("supertest-session");
// import mockAxios from "jest-mock-axios";
import { pollingDataExistsResponse } from "./mockApiResponses/pollingDataExists";
import { addressPickerResponse } from "./mockApiResponses/addressPickerResponse";
import axios from "axios";

// Mock jest and set the type
jest.mock("axios");
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios>;

// afterEach(() => {
//   // cleaning up the mess left behind the previous test
//   mockAxios.reset();
// });

describe("app", () => {
  it("says hello", async () => {
    const result = await supertest(app).get("/");
    expect(result.status).toBe(200);
    expect(result.text).toBe("hello world");
  });

  it("verifies the postcode", async () => {
    const postcodeRequest = { postcode: "TN4TWH" };
    mockedAxiosGet.mockResolvedValueOnce({ data: pollingDataExistsResponse });
    const result = await supertest(app)
      .post("/postcode")
      .set("origin", process.env.FRONT_END_DOMAIN)
      .send(postcodeRequest);
    expect(mockedAxiosGet).toHaveBeenCalledWith(
      `https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
    );
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      pollingStationFound: true,
      pollingStations: [],
    });
  });

  it("returns several addresses", async () => {
    const postcodeRequest = { postcode: "TN4TWH" };
    mockedAxiosGet.mockResolvedValueOnce({ data: addressPickerResponse });
    const result = await supertest(app)
      .post("/postcode")
      .set("origin", process.env.FRONT_END_DOMAIN)
      .send(postcodeRequest);
    expect(mockedAxiosGet).toHaveBeenCalledWith(
      `https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
    );
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
    await supertest(app).post("/postcode").send(postcodeRequest).expect(400);
  });
});
