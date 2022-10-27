exports.mockPort = {
	on: (event, callback) => {},
	write: (...data) => console.log('SERIAL ->', ...data),
	pipe: (_) => ({
		on: (event, callback) => {}
	})
}