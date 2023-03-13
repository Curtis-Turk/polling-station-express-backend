"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectoralCommisionApi = void 0;
class ElectoralCommisionApi {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /* fetches polling station information from the Electoral Commision Api
    EC endpoint information and response examples: https://api.electoralcommission.org.uk/docs/ */
    async verifyPostcode(postcode) {
        const response = await fetch(`https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`);
        const result = await response.json();
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
