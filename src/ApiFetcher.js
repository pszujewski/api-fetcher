import ApiSource from './ApiSource';
import { makeCancelable } from './makeCancelable';

export class ApiFetcher {
	constructor(urlPrefix, config) {
		this.api = new ApiSource(urlPrefix, config);
	}

	setFetchOptions(fetchOptions) {
		this.api.setFetchOptions(fetchOptions);
	}

	get(endpoint) {
		return this.api.call('GET', endpoint);
	}

	cancelableGet(endpoint) {
		return makeCancelable(this.get(endpoint));
	}

	post(endpoint, body) {
		return this.api.call('POST', endpoint, body);
	}

	cancelablePost(endpoint, body) {
		return makeCancelable(this.post(endpoint, body));
	}

	del(endpoint) {
		return this.api.call('DELETE', endpoint);
	}

	cancelableDel(endpoint) {
		return makeCancelable(this.del(endpoint));
	}

	call(httpMethod, endpoint, body) {
		return this.api.call(httpMethod, endpoint, body);
	}

	cancelableCall(httpMethod, endpoint, body) {
		return makeCancelable(this.call(httpMethod, endpoint, body));
	}

	put(endpoint, body) {
		return this.api.call('PUT', endpoint, body);
	}

	cancelablePut(endpoint, body) {
		return makeCancelable(this.put(endpoint, body));
	}

	revoke(request) {
		if (request && typeof request.cancel === 'function') {
			request.cancel();
		}
	}
}
