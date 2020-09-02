import handleApiFetchError from './apiErrorHandler';

export default class ApiSource {
	constructor(urlPrefix, config) {
		this.urlPrefix = urlPrefix;
		this.config = config;
		this.fetchOptions = null;
	}

	call(method, endpoint, body, config = this.config) {
		const url = this.getRequestUrl(endpoint);
		const options = this.getRequestOptions(method, body);
		return this.fetchFromApi(url, options, config);
	}

	setFetchOptions(fetchOptions) {
		if (fetchOptions && typeof fetchOptions === 'object') {
			this.fetchOptions = fetchOptions;
		} else {
			console.error('You must provide an object to setFetchOptions');
		}
	}

	fetchFromApi(url, options, config) {
		return fetch(url, options)
			.then(response => this.onResponse(response, config))
			.then(jsonData => this.onData(jsonData, config));
	}

	onResponse(response, config) {
		const isValid = this.isValidConfig(config);

		if (isValid && typeof config.onResponse === 'function') {
			return config.onResponse(response);
		}

		return handleApiFetchError(response).then(r => this.getData(r));
	}

	getData = response => {
		if (!response) {
			return new Promise(resolve => resolve());
		}

		if (response.statusText === 'No Content') {
			return new Promise(resolve => resolve());
		}

		return response.text().then(text => {
			if (text) {
				return JSON.parse(text);
			}
			return null;
		});
	};

	onData(jsonData, config) {
		const isValid = this.isValidConfig(config);

		if (isValid && typeof config.onData === 'function') {
			return config.onData(jsonData);
		}
		return jsonData;
	}

	isValidConfig(config) {
		return config && typeof config === 'object';
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
		if (this.fetchOptions && this.userDidProvideValidOptions()) {
			return { method, ...this.fetchOptions };
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

	userDidProvideValidOptions() {
		return Object.keys(this.fetchOptions).length > 0;
	}
}
