import axios from "axios";

interface addressObject {
  address: string;
  postcode: string;
  slug: string;
}

interface responseAddressObject extends addressObject {
  url: string;
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
      `https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`
    )) as any;
    const result = response.data;
    if (result.dates.length)
      return {
        pollingStationFound: true,
        pollingStations: [],
      };

    if (result.address_picker) {
      const pollingStations = result.addresses.map(
        (addressObject: responseAddressObject) => {
          const { address, postcode, slug } = addressObject;
          return { address, postcode, slug };
        }
      );
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
