import * as React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

const IndexPage = () => {
	const navigate = useNavigate()

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		;(async () => {
			// Check if the user is already logged in
			if (user) {
				navigate('/dashboard')
				return
			} else {
				// Get /me to check if the user is logged in
				try {
					const response = await axios.get(
						`${import.meta.env.VITE_API_URL}/api/accounts/me`,
						{
							withCredentials: true,
						},
					)

					dispatch(setUser(response.data))
					navigate('/dashboard')
				} catch (error) {
					navigate('/login')
				}
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <p>Loading...</p>
}

export default IndexPage
