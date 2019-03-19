import { ApiFetcher } from '../src/ApiFetcher';

function fetchMock(resolveWith) {
	const defaultResolve = { id: '123', message: 'success' };
	global.fetch = jest.fn().mockImplementation(() => {
		return new Promise(resolve => {
			resolve({
				ok: true,
				json: () => (resolveWith ? resolveWith : defaultResolve),
			});
		});
	});
}

const setupFetcher = () => {
	const prefix = 'http://hello.com/api';
	const fetcher = new ApiFetcher(prefix);
	return fetcher;
};

describe('ApiFetcher', () => {
	it('Should set a urlPrefix for all calls', () => {
		const fetcher = setupFetcher();
		expect(fetcher.api.urlPrefix).toBe('http://hello.com/api');
	});

	it('Should set options for fetch if given by user', () => {
		const fetcher = setupFetcher();
		const testOptions = {
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
			referrer: 'no-referrer',
		};

		fetcher.setFetchOptions(testOptions);
		expect(fetcher.api.fetchOptions).toEqual(testOptions);
	});

	it('Should return a response Promise for .get() method', () => {
		fetchMock();
		const fetcher = setupFetcher();

		expect.assertions(1);
		return fetcher.get('/123').then(data => {
			return expect(data).toEqual({ id: '123', message: 'success' });
		});
	});

	it('Should return a wrapped Promise for .cancelableGet()', () => {
		fetchMock({ id: '345' });
		const fetcher = setupFetcher();

		const { promise, cancel } = fetcher.cancelableGet('/123');
		expect(typeof cancel).toBe('function');
		expect(promise).toBeInstanceOf(Promise);
	});
});
