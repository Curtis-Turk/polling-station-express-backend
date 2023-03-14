"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectoralCommisionApi = void 0;
// import fetch from "node-fetch";
const axios_1 = __importDefault(require("axios"));
class ElectoralCommisionApi {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /* fetches polling station information from the Electoral Commision Api
    EC endpoint information and response examples: https://api.electoralcommission.org.uk/docs/ */
    async verifyPostcode(postcode) {
        const response = (await axios_1.default.get(
        // `https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`
        `https://api.electoralcommission.org.uk/api/v1/postcode/TN39PS?token=${this.apiKey}`));
        const result = response.data;
        // const result = (await response) as any;
        if (result.dates.length)
            return {
                pollingStationFound: true,
                pollingStations: [],
            };
        if (result.address_picker) {
            const pollingStations = result.addresses.map((address) => {
                {
                    address.address, address.postcode, address.slug;
                }
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
}
exports.ElectoralCommisionApi = ElectoralCommisionApi;
