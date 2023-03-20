import axios, { AxiosResponse } from 'axios';

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
	errorMessage?: string;
}

export class ElectoralCommisionApi {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	/* fetches polling station information from the Electoral Commision Api
  EC endpoint information and response examples: https://api.electoralcommission.org.uk/docs/ */
	async verifyPostcode(postcode: string): Promise<pollingStationsObject> {
		try {
			const response = (await axios.get(
				`https://api.electoralcommission.org.uk/api/v1/postcode/${postcode}?token=${this.apiKey}`
				// axios will timeout after 5 seconds
				// { timeout: 5 }
			)) as AxiosResponse;

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
		} catch (e: any) {
			const errorMessage =
				e.response &&
				e.response.data.message === 'Could not geocode from any source'
					? e.response?.data.message
					: 'Connection issue whilst verifying postcode';
			return { errorMessage, pollingStationFound: false, pollingStations: [] };
		}
	}

	/* getting a polling station once addressPicker step has been completed */
	async verifyAddress(addressSlug: string): Promise<pollingStationsObject> {
		try {
			const response = (await axios.get(
				`https://api.electoralcommission.org.uk/api/v1/address/${addressSlug}?token=${this.apiKey}`
				// axios will timeout after 5 seconds
				// { timeout: 5 }
			)) as AxiosResponse;

			const result = response.data;

			if (result.dates.length)
				return {
					pollingStationFound: true,
					pollingStations: [],
				};

			return {
				pollingStationFound: false,
				pollingStations: [],
			};
		} catch (e: any) {
			const errorMessage =
				e.response &&
				e.response.data.message === 'Could not geocode from any source'
					? e.response?.data.message
					: 'Connection issue whilst verifying postcode';
			return { errorMessage, pollingStationFound: false, pollingStations: [] };
		}
	}
}
