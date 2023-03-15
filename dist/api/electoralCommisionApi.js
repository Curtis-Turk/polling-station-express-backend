"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectoralCommisionApi = void 0;
const axios_1 = __importDefault(require("axios"));
class ElectoralCommisionApi {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /* fetches polling station information from the Electoral Commision Api
    EC endpoint information and response examples: https://api.electoralcommission.org.uk/docs/ */
    async verifyPostcode(postcode) {
        try {
            const response = (await axios_1.default.get(`https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`
            // axios will timeout after 5 seconds
            // { timeout: 5 }
            ));
            const result = response.data;
            if (result.dates.length)
                return {
                    pollingStationFound: true,
                    pollingStations: [],
                };
            if (result.address_picker) {
                const pollingStations = result.addresses.map((addressObject) => {
                    const { address, postcode, slug } = addressObject;
                    return { address, postcode, slug };
                });
                return {
                    pollingStationFound: false,
                    pollingStations,
                };
            }
            return {
                pollingStationFound: false,
                pollingStations: [],
            };
        }
        catch (e) {
            const errorMessage = e.response &&
                e.response.data.message === "Could not geocode from any source"
                ? e.response?.data.message
                : "Connection issue whilst verifying postcode";
            return { errorMessage, pollingStationFound: false, pollingStations: [] };
        }
    }
}
exports.ElectoralCommisionApi = ElectoralCommisionApi;
