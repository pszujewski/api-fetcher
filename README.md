# api-fetcher-treeline

[![Greenkeeper badge](https://badges.greenkeeper.io/rollup/rollup-starter-lib.svg)](https://greenkeeper.io/)

## Install

```bash
npm install --save api-fetcher-treeline
```

To polyfill `Promise` and `fetch` [see here](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill)

## Basic usage

```javascript
// In api.js ...
import { ApiFetcher } from 'api-fetcher-treeline/dist';

const setupApiFetcher = urlPrefix => {
	const api = new ApiFetcher(urlPrefix);

	if (process.env.NODE_ENV === 'production') {
		api.setFetchOptions(/*Custom fetch options*/);
	}

	return api;
};

const api = setupApiFetcher('https://somewhere.com/api');

export default api;
```

Then use it in react components:

```jsx
import React from 'react';
import api from '../api';

export default class MyComponent extends React.Component {
	state = { todos: [] };

	render() {
		return <div id="some-content" />;
	}

	// Send a GET request to endpoint /todos wrapped
	// in the ability to cancel it if the component unmounts
	// before the fetch has completed
	componentDidMount() {
		this.fetchRequest = api.cancelableGet('/todos');
		const { promise } = this.fetchRequest;
		promise.then(todos => /*Do something with todos*/)
	}

	// Always cancel your requests in componentWillUnmount. This will have no effect
	// if the Promise has already resolved and its side effects have been issued.
	componentWillUnmount() {
		this.fetchRequest.cancel();
	}
}
```

Here is the class definition with some comments.

```javascript
import ApiSource from './ApiSource';
import { makeCancelable } from './makeCancelable';

export class ApiFetcher {
	constructor(urlPrefix) {
		this.api = new ApiSource(urlPrefix);
	}

	// Use this to alter the default options passed to the fetch api
	setFetchOptions(fetchOptions) {
		this.api.setFetchOptions(fetchOptions);
	}

	// Sends a plain GET request using the Fetch api
	get(endpoint) {
		return this.api.call('GET', endpoint);
	}

	// Sends a 'WrappedPromise' GET request (see notes below...)
	cancelableGet(endpoint) {
		return makeCancelable(this.get(endpoint));
	}

	post(endpoint, body) {
		return this.api.call('POST', endpoint, body);
	}

	// 'body' is the request body passed to fetch. It will be Json.stringify()ed
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
}
```

**All the "cancelable" methods return a "WrappedPromise" object that is shaped like this:**

```javascript
const wrappedPromiseExample = {
	promise: [Promise], // This key points to the actual pending Promise
	cancel: [Function], // This function will reject() the Promise
};
```

**Here are the default options passed on to the browser fetch api**

```javascript
const defaultFetchOptions = {
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json ; charset=utf-8',
	},
	credentials: 'include',
	mode: 'cors',
};
```

To overwrite these options, use the `setFetchOptions()` method

```javascript
const setupApiFetcher = urlPrefix => {
	const api = new ApiFetcher(urlPrefix);

	if (process.env.NODE_ENV === 'production') {
		api.setFetchOptions({ mode: 'cors', ...myOtherProdFetchOptions });
	}

	return api;
};
```

## Contributing

Submit a pull request!

To run the test suite, run `npm test`.

## License

[MIT](LICENSE).
