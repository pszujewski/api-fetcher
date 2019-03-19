# api-fetcher-treeline

[![Greenkeeper badge](https://badges.greenkeeper.io/rollup/rollup-starter-lib.svg)](https://greenkeeper.io/)

## Install

```bash
npm install --save api-fetcher-treeline
```

To polyfill `Promise` and `fetch` [see here](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill)

## Basic usage

```javascript
// In api.js

import { ApiFetcher } from 'api-fetcher-treeline';

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
		return /**something**/;
	}

    // Send a GET request to endpoint /todos wrapped
    // in the ability to cancel it if the component unmounts
    // before the fetch has completed
	componentDidMount() {
        this.fetchRequest = api.cancelableGet('/todos');
        const { promise } = this.fetchRequest;
        promise.then(todos => /*Do something with todos*/)
	}

	componentWillUnmount() {
		this.fetchRequest.cancel();
	}
}
```

## License

[MIT](LICENSE).
