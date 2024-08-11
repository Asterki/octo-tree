import * as React from 'react'

import axios from 'axios'

const TestPage = () => {
	const makeRequest = async () => {
		try {
			const response = await axios({
				url: 'http://localhost:5000/api/soil/ping',
				method: 'GET',
			})

			console.log(response.data)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div>
			<h1>ejwioqejqwoje</h1>

			<button onClick={makeRequest}>Make Request</button>
		</div>
	)
}

export default TestPage
