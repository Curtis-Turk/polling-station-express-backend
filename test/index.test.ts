import { app } from '../index';
const supertest = require('supertest-session');
import { pollingDataExistsResponse } from './mockApiResponses/pollingDataExists';
import { addressPickerResponse } from './mockApiResponses/addressPickerResponse';
import { noUpcomingBallotsResponse } from './mockApiResponses/noUpcomingBallotsResponse';
import { postcodeNotFound } from './mockApiResponses/postcodeNotFound';
import axios, { AxiosError } from 'axios';
jest.mock('axios');
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios>;

describe('app', () => {
	it('says hello', async () => {
		const result = await supertest(app).get('/');
		expect(result.status).toBe(200);
		expect(result.text).toBe('hello world');
	});

	it('verifies the postcode', async () => {
		const postcodeRequest = { postcode: 'TN4TWH' };
		mockedAxiosGet.mockResolvedValueOnce({ data: pollingDataExistsResponse });
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
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

	it('returns several addresses', async () => {
		const postcodeRequest = { postcode: 'TN4TWH' };
		mockedAxiosGet.mockResolvedValueOnce({ data: addressPickerResponse });
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
			.send(postcodeRequest);
		expect(mockedAxiosGet).toHaveBeenCalledWith(
			`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
		);
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
		mockedAxiosGet.mockResolvedValueOnce({ data: noUpcomingBallotsResponse });
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
			.send(postcodeRequest);
		expect(mockedAxiosGet).toHaveBeenCalledWith(
			`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
		);
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
				data: postcodeNotFound,
				status: 400,
			},
		});
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
			.send(postcodeRequest);
		expect(mockedAxiosGet).toHaveBeenCalledWith(
			`https://api.electoralcommission.org.uk/api/v1/postcode/aaaaaa?token=${process.env.EC_API_KEY}`
		);
		expect(result.status).toBe(400);
		expect(result.body).toEqual({
			errorMessage: 'Could not geocode from any source',
			pollingStationFound: false,
			pollingStations: [],
		});
	});

	it("returns an error message if axios couldn't connect", async () => {
		const postcodeRequest = { postcode: 'TN4TWH' };
		mockedAxiosGet.mockRejectedValue(new AxiosError());
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
			.send(postcodeRequest);
		expect(mockedAxiosGet).toHaveBeenCalledWith(
			`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
		);
		expect(result.status).toBe(400);
		expect(result.body).toEqual({
			errorMessage: 'Connection issue whilst verifying postcode',
			pollingStationFound: false,
			pollingStations: [],
		});
	});

	it('returns an error message if axios hangs', async () => {
		const postcodeRequest = { postcode: 'TN4TWH' };
		mockedAxiosGet.mockResolvedValue(new AxiosError());
		const result = await supertest(app)
			.post('/postcode')
			.set('origin', process.env.FRONT_END_DOMAIN)
			.send(postcodeRequest);
		expect(mockedAxiosGet).toHaveBeenCalledWith(
			`https://api.electoralcommission.org.uk/api/v1/postcode/TN4TWH?token=${process.env.EC_API_KEY}`
		);
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
		await supertest(app).post('/postcode').send(postcodeRequest).expect(400);
	});
});
