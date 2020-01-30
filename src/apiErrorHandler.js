const handleApiFetchError = response =>
	new Promise((resolve, reject) => {
		if (!response || response.ok) {
			resolve(response);
		}

		let error;

		switch (response.status) {
			case 401:
				error = 'Unauthorized';
				break;
			case 403:
				error = 'Forbidden';
				break;
			case 404:
				error = 'Not Found';
				break;
			case 500:
				error = 'Internal Server Error';
				break;
			default:
				error = `Http Status Code ${response.status}`;
				break;
		}

		const errorMessage =
			response.statusText && response.statusText.length > 0
				? ` - ${response.statusText}`
				: '';

		reject(new Error(error + errorMessage));
	});

export default handleApiFetchError;
