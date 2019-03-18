export default function fetchMock() {
	global.fetch = jest.fn().mockImplementation(() => {
		const p = new Promise(resolve => {
			resolve({
				ok: true,
				json: () => ({ id: '123', message: 'success' }),
			});
		});
		return p;
	});
}
