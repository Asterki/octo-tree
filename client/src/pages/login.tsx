import * as React from 'react'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import NavbarComponent from '../components/navbar'

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
			<NavbarComponent />

			<main className="min-h-screen flex items-center justify-center">
				<form className="md:w-3/12 w-11/12">
					<h1 className="text-3xl font-bold text-center">Login</h1>
					<p className="text-center">
						Welcome back! Please login to your account to continue
						using our services.
					</p>

					<div className="flex flex-col items-center mt-4">
						<input
							type="email"
							ref={emailRef}
							placeholder="Email"
							className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
						/>

						<input
							type="password"
							ref={passwordRef}
							placeholder="Password"
							className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
						/>
						<button
							type="button"
							onClick={login}
							className="bg-emerald-700 text-white w-full p-2 rounded-md mt-4 hover:brightness-110 transition-all"
						>
							Login
						</button>
					</div>

					<p className="mt-2 text-center">
						Don't have an account?{' '}
						<a href="/register" className="text-emerald-700">
							Register
						</a>
					</p>
				</form>
			</main>
		</div>
	)
}

export default LoginPage
