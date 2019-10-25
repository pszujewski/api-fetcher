import { ApiFetcher } from '../src/ApiFetcher';

const mockedFetch = jest.fn();

function fetchMock(resolveWith) {
	const defaultResolve = { id: '123', message: 'success' };
	global.fetch = mockedFetch.mockImplementation(() => {
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

const defaultOptions = {
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json ; charset=utf-8',
	},
	credentials: 'include',
	mode: 'cors',
};

const urlPrefix = 'http://hello.com/api';

describe('ApiFetcher', () => {
	it('Should set a urlPrefix for all calls', () => {
		const fetcher = setupFetcher();
		expect(fetcher.api.urlPrefix).toBe(urlPrefix);
	});

	it('api.fetchOptions should be null by default', () => {
		const fetcher = setupFetcher();
		expect(fetcher.api.fetchOptions).toBeNull();
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

	it('Should prevent a user from invoking setFetchOptions using falsey values', () => {
		const fetcher = setupFetcher();
		fetcher.setFetchOptions(undefined);
		expect(fetcher.api.fetchOptions).toBeNull();
		expect(fetcher.api.getFetchOptions('GET')).toEqual({
			method: 'GET',
			...defaultOptions,
		});
	});

	it('Should prevent a user from invoking setFetchOptions with a string', () => {
		const fetcher = setupFetcher();
		fetcher.setFetchOptions('hello');
		expect(fetcher.api.fetchOptions).toBeNull();
		expect(fetcher.api.getFetchOptions('GET')).toEqual({
			method: 'GET',
			...defaultOptions,
		});
	});

	it('Should add the httpMethod to any fetchOptions provided by the user when making a request', () => {
		const fetcher = setupFetcher();
		const testOptions = {
			mode: 'cors',
			referrer: 'no-referrer',
		};
		const body = { clientId: 'ABC' };

		fetcher.setFetchOptions(testOptions);
		const delReqExample = fetcher.api.getRequestOptions('DELETE');
		const options = fetcher.api.getRequestOptions('POST', body);

		const expected = {
			method: 'POST',
			body: JSON.stringify(body),
			...testOptions,
		};
		expect(delReqExample).toEqual({ method: 'DELETE', ...testOptions });
		expect(options).toEqual(expected);
	});

	it('Should add the httpMethod to the default fetchOptions if none are provided by the user', () => {
		const fetcher = setupFetcher();
		const body = { clientId: 'ABC' };
		const options = fetcher.api.getRequestOptions('POST', body);
		const expected = {
			method: 'POST',
			body: JSON.stringify(body),
			...defaultOptions,
		};
		expect(options).toEqual(expected);
	});

	it('Should send a request using the root urlPrefix if no endpoint is given', () => {
		const fetcher = setupFetcher();
		expect(fetcher.api.getRequestUrl()).toBe(urlPrefix);
	});

	it('Should append endpoints to the urlPrefix', () => {
		const fetcher = setupFetcher();
		const expectedUri = `${urlPrefix}/todos`;
		expect(fetcher.api.getRequestUrl('/todos')).toBe(expectedUri);
	});

	it('Should return a response Promise for .get() method', () => {
		fetchMock();
		const fetcher = setupFetcher();

		expect.assertions(1);
		return fetcher.get('/123').then(data => {
			return expect(data).toEqual({ id: '123', message: 'success' });
		});
	});

	it('Should call underlying fetch API with a url and fetch options object', () => {
		fetchMock();
		const fetcher = setupFetcher();
		expect.assertions(1);
		return fetcher.get('/123').then(() => {
			const fullUri = `${urlPrefix}/123`;
			const options = { method: 'GET', ...defaultOptions };
			return expect(mockedFetch).toHaveBeenCalledWith(fullUri, options);
		});
	});

	it('Should return a wrapped Promise for .cancelableGet()', () => {
		fetchMock({ id: '345' });
		const fetcher = setupFetcher();
		const { promise, cancel } = fetcher.cancelableGet('/123');
		expect(typeof cancel).toBe('function');
		expect(promise).toBeInstanceOf(Promise);
	});

	it('Should call fetch API with a url and custom fetch options if given', () => {
		const fakeBody = { name: 'Laundry' };
		const fakeResponse = { todos: [{ name: 'Groceries' }] };
		fetchMock(fakeResponse);
		const fetcher = setupFetcher();
		const testOptions = {
			mode: 'cors',
			hello: 'hello',
			referrer: 'no-referrer',
		};
		fetcher.setFetchOptions(testOptions);

		expect.assertions(1);
		const request = fetcher.cancelablePost('/todos', fakeBody);
		return request.promise.then(() => {
			const fullUri = `${urlPrefix}/todos`;
			const expectedOptions = {
				method: 'POST',
				body: JSON.stringify(fakeBody),
				...testOptions,
			};
			return expect(mockedFetch).toHaveBeenCalledWith(
				fullUri,
				expectedOptions,
			);
		});
	});

	it('Should have put and cancelablePut methods', () => {
		fetchMock({ putSuccess: true });
		const fetcher = setupFetcher();

		const request = fetcher.put('/todos', { name: 'Laundry' });
		const wrappedReq = fetcher.cancelablePut('/todos', { name: 'Laundry' });

		expect(typeof wrappedReq.cancel).toBe('function');
		expect(wrappedReq.promise).toBeInstanceOf(Promise);
		expect(request).toBeInstanceOf(Promise);
	});

	it('Should accept a config object in the constructor for defining onResponse and onData functions', () => {
		fetchMock();

		const expected = {
			id: '123',
			message: 'success',
			didCallOnResponse: true,
			didCallOnData: true,
		};

		const config = {
			onResponse: response => {
				if (response.ok) {
					const toAdd = { didCallOnResponse: true };
					const data = response.json();
					return { ...data, ...toAdd };
				}
			},
			onData: data => {
				if (data.didCallOnResponse) {
					return { ...data, didCallOnData: true };
				}
			},
		};

		const fetcher = new ApiFetcher('http://hello.com/api', config);

		return fetcher.get('/todos').then(result => {
			return expect(result).toEqual(expected);
		});
	});

	it('Should accept an optional onCatch method on the config object', () => {
		fetchMock();
		const expectedErrorMessage = 'Horrible error';

		const config = {
			onData: data => {
				throw new Error(expectedErrorMessage);
			},
			onCatch: err => {
				return expect(err.message).toBe(expectedErrorMessage);
			},
		};

		const fetcher = new ApiFetcher('http://hello.com/api', config);

		return fetcher.get('/todos');
	});
});
