// import fetch from "node-fetch";
import axios from "axios";

interface addressObject {
  address?: string;
  postcode?: string;
  slug?: string;
}

interface pollingStationsObject {
  pollingStationFound: boolean;
  pollingStations: addressObject[];
}
export class ElectoralCommisionApi {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /* fetches polling station information from the Electoral Commision Api
  EC endpoint information and response examples: https://api.electoralcommission.org.uk/docs/ */
  async verifyPostcode(postcode: string): Promise<pollingStationsObject> {
    const response = (await axios.get(
      // `https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`
      `https://api.electoralcommission.org.uk/api/v1/postcode/TN39PS?token=${this.apiKey}`
    )) as any;
    const result = response.data;
    // const result = (await response) as any;
    if (result.dates.length)
      return {
        pollingStationFound: true,
        pollingStations: [],
      };

    if (result.address_picker) {
      const pollingStations = result.addresses.map((address: addressObject) => {
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
