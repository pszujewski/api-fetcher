import { ApiFetcher } from '../src/ApiFetcher';

function fetchMock() {
	global.fetch = jest.fn().mockImplementation(() => {
		const p = new Promise(resolve => {
			resolve({
				ok: true,
				json: () => ({ id: '123', message: 'success' }),
			});
		});
		return p;
	});
}

beforeEach(() => {
	fetchMock();
});

describe('ApiFetcher', () => {
	it('Should set a urlPrefix for all calls', () => {
		const prefix = 'http://hello.com/api';
		const fetcher = new ApiFetcher(prefix);
		expect(fetcher.api.urlPrefix).toBe(prefix);
	});
});
