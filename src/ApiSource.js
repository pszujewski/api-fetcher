export default class ApiSource {
	constructor(urlPrefix) {
		this.urlPrefix = urlPrefix;
		this.fetchOptions = null;
	}

	call(method, endpoint, body) {
		const url = this.getRequestUrl(endpoint);
		const options = this.getRequestOptions(method, body);
		return this.fetchFromApi(url, options);
	}

	setFetchOptions(fetchOptions) {
		this.fetchOptions = fetchOptions;
	}

	fetchFromApi(url, options) {
		return fetch(url, options)
			.then(response => response.json())
			.catch(err => console.error(err));
	}

	getRequestOptions(method, body) {
		let options = this.getFetchOptions(method);
		if (body) {
			options = Object.assign({}, options, {
				body: JSON.stringify(body),
			});
		}
		return options;
	}

	getFetchOptions(method) {
		if (this.fetchOptions) {
			return this.fetchOptions;
		}
		return this.getDefaultFetchOptions(method);
	}

	getDefaultFetchOptions = method => ({
		method,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json ; charset=utf-8',
		},
		credentials: 'include',
		mode: 'cors',
	});

	getRequestUrl(endpoint = '') {
		return `${this.urlPrefix}${endpoint.trim()}`;
	}
}
