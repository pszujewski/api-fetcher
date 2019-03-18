import { ApiFetcher } from '..';
import fetchMock from '../testing-utils/fetch-mock';

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
