import * as React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

const HomePage = () => {
	const navigate = useNavigate()

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		;(async () => {
			// Check if the user is logged in
			if (!user) {
				// Get the user's data
				try {
					const response = await axios({
						url: `${import.meta.env.VITE_API_URL}/api/accounts/me`,
						method: 'get',
						withCredentials: true,
					})

					dispatch(setUser(response.data))
				} catch (error) {
					navigate('/login')
				}
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div>
			<p>This will be the home page</p>
		</div>
	)
}

export default HomePage
