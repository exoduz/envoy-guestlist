export const getApiDetails = () => {
	const url    = 'https://mini-visitors-service.herokuapp.com/api/entries';
	const apiKey = '3ad831983963ea97c93f';

	return {
		url:     url,
		options: {
			headers: {
				'X-Api-Key': apiKey,
			},
		}
	}
}

export const buildPayload = data => {
	return Object.assign( {}, {
		data: {
			type: 'entries',
			...data
		},
	} );
}
