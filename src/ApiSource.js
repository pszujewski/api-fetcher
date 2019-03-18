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

	async fetchFromApi(url, options) {
		let json;
		try {
			const response = await fetch(url, options);
			json = await response.json();
		} catch (err) {
			console.error(`Failed to fetch: ${err.message}`);
		}
		return json;
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
