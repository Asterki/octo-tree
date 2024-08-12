import * as React from 'react'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const passwordRef = React.useRef<HTMLInputElement>(null)
	const emailRef = React.useRef<HTMLInputElement>(null)

	const login = async () => {
		try {
			const response = await axios({
				url: `${import.meta.env.VITE_API_URL}/api/accounts/login`,
				method: 'POST',
				data: {
					email: emailRef.current?.value,
					password: passwordRef.current?.value,
				},
				withCredentials: true,
			})

			if (response.status == 200) {
				// Get the user's data
				const userResponse = await axios({
					url: `${import.meta.env.VITE_API_URL}/api/accounts/me`,
					method: 'GET',
					withCredentials: true,
				})

				dispatch(setUser(userResponse.data))
				navigate('/dashboard')
			} else {
				alert('Incorrect credentials!')
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 401) {
					alert('Incorrect credentials!')
				} else {
					alert('An error occurred. Please try again later.')
				}
			}
		}
	}

	// Check if the user is already logged in
	React.useEffect(() => {
		;(async () => {
			if (user) {
				navigate('/dashboard')
			} else {
				// Get the user's data
				try {
					const response = await axios({
						url: `${import.meta.env.VITE_API_URL}/api/accounts/me`,
						method: 'get',
						withCredentials: true,
					})

					dispatch(setUser(response.data))
					navigate('/dashboard')
				} catch (error) {
					navigate('/login')
				}
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			{/* Navbar */}
			<div className="bg-emerald-700 shadow-md text-white w-full flex items-center justify-between px-4 absolute top-0">
				<h1 className="text-3xl font-bold p-4">Octo Tree</h1>
			</div>

			<main className="min-h-screen flex items-center justify-center">
				<form action="">
					<h1 className="text-3xl font-bold text-center">Login</h1>
					<div className="flex flex-col items-center mt-4">
						<input
							type="email"
							ref={emailRef}
							placeholder="Email"
							className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
						/>

						<input
							type="password"
							ref={passwordRef}
							placeholder="Password"
							className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
						/>
						<button
							type="button"
							onClick={login}
							className="bg-emerald-700 text-white w-80 p-2 rounded-md mt-4"
						>
							Login
						</button>
					</div>
				</form>
			</main>
		</div>
	)
}

export default LoginPage
