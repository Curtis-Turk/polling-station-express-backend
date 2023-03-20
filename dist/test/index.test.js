"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const supertest = require('supertest-session');
const pollingDataExists_1 = require("./mockApiResponses/pollingDataExists");
const addressPickerResponse_1 = require("./mockApiResponses/addressPickerResponse");
const noUpcomingBallotsResponse_1 = require("./mockApiResponses/noUpcomingBallotsResponse");
const postcodeNotFound_1 = require("./mockApiResponses/postcodeNotFound");
const axios_1 = __importStar(require("axios"));
jest.mock('axios');
const mockedAxiosGet = axios_1.default.get;
describe('app', () => {
    it('says hello', async () => {
        const result = await supertest(index_1.app).get('/');
        expect(result.status).toBe(200);
        expect(result.text).toBe('hello world');
    });
    it('verifies the postcode', async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        mockedAxiosGet.mockResolvedValueOnce({ data: pollingDataExists_1.pollingDataExistsResponse });
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: true,
            pollingStations: [],
        });
    });
    it('returns several addresses', async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        mockedAxiosGet.mockResolvedValueOnce({ data: addressPickerResponse_1.addressPickerResponse });
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: false,
            pollingStations: [
                {
                    address: '16 DUNCAN CLOSE, ST. MELLONS, CARDIFF',
                    postcode: 'CF3 1NP',
                    slug: '100100106448',
                },
                {
                    address: '26 DUNCAN CLOSE, ST. MELLONS, CARDIFF',
                    postcode: 'CF3 1NP',
                    slug: '100100106458',
                },
            ],
        });
    });
    // PART OF ELECTION WEEK BOT
    //  testing verifyAddress
    // it("verifies from address slug", async () => {
    //   const addressRequest = { slug: "100100106448" };
    //   mockedAxiosGet.mockResolvedValueOnce({ data: pollingDataExistsResponse });
    //   const result = await supertest(app)
    //     .post("/address")
    //     .set("origin", process.env.FRONT_END_DOMAIN)
    //     .send(addressRequest);
    //   expect(mockedAxiosGet).toHaveBeenCalledWith(
    //     `https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
    //   );
    //   expect(result.status).toBe(200);
    //   expect(result.body).toEqual({
    //     pollingStationFound: true,
    //     pollingStations: [],
    //   });
    // });
    it('returns no polling station or addresses if no upcoming ballots in area', async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        mockedAxiosGet.mockResolvedValueOnce({ data: noUpcomingBallotsResponse_1.noUpcomingBallotsResponse });
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            pollingStationFound: false,
            pollingStations: [],
        });
    });
    it('returns an error message if postcode not found', async () => {
        const postcodeRequest = { postcode: 'aaaaaa' };
        // axios will throw an error with status 400
        mockedAxiosGet.mockRejectedValue({
            response: {
                data: postcodeNotFound_1.postcodeNotFound,
                status: 400,
            },
        });
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/aaaaaa?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            errorMessage: 'Could not geocode from any source',
            pollingStationFound: false,
            pollingStations: [],
        });
    });
    it("returns an error message if axios couldn't connect", async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        mockedAxiosGet.mockRejectedValue(new axios_1.AxiosError());
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            errorMessage: 'Connection issue whilst verifying postcode',
            pollingStationFound: false,
            pollingStations: [],
        });
    });
    it('returns an error message if axios hangs', async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        mockedAxiosGet.mockResolvedValue(new axios_1.AxiosError());
        const result = await supertest(index_1.app)
            .post('/postcode')
            .set('origin', process.env.FRONT_END_DOMAIN)
            .send(postcodeRequest);
        expect(mockedAxiosGet).toHaveBeenCalledWith(`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`);
        expect(result.status).toBe(400);
        expect(result.body).toEqual({
            errorMessage: 'Connection issue whilst verifying postcode',
            pollingStationFound: false,
            pollingStations: [],
        });
    });
    // Test if axios times out
    it('returns a 400 status with incorrect origin', async () => {
        const postcodeRequest = { postcode: 'TN4TWH' };
        await supertest(index_1.app).post('/postcode').send(postcodeRequest).expect(400);
    });
});
