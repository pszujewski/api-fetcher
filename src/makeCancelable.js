/**
 *
 * @param {Promise} promise
 * @returns {Object}
 *
 * Produces object containing reference to resolved promise and
 * a "cancel" method that will force a rejection of the promise
 */
export const makeCancelable = promise => {
	let hasCanceled_ = false;

	const wrappedPromise = new Promise((resolve, reject) => {
		promise.then(
			val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
			error => {
				console.warn(`Promise canceled: ${error.message}`);
				hasCanceled_ ? reject({ isCanceled: true }) : reject(error);
			},
		);
	});

	return {
		promise: wrappedPromise,
		cancel() {
			hasCanceled_ = true;
		},
	};
};
