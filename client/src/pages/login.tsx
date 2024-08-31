import * as React from 'react'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import NavbarComponent from '../components/navbar'
import AlertComponent from '../components/alert'

import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
	const navigate = useNavigate()

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const passwordRef = React.useRef<HTMLInputElement>(null)
	const emailRef = React.useRef<HTMLInputElement>(null)

	const [alertState, setAlertState] = React.useState({
		show: false,
		content: '',
	})

	const showAlert = (content: string) => {
		setAlertState({
			show: true,
			content,
		})

		setTimeout(() => {
			setAlertState({
				show: false,
				content: '',
			})
		}, 3000)
	}

	const login = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			if (!emailRef.current?.value || !passwordRef.current?.value) {
				showAlert('Please fill in all the fields!')
				return
			}

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
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 401)
					showAlert('Invalid email or password!')
				else if (error.response?.status == 400)
					showAlert('Please fill in all the fields!')
				else if (error.response?.status == 500)
					showAlert(
						'An error occurred while processing your request!'
					)
				else showAlert('Something went wrong. Please try again later.')
			} else {
				showAlert('Something went wrong. Please try again later.')
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
						method: 'GET',
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
				<form className="md:w-3/12 w-11/12" onSubmit={(e) => login(e)}>
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
							type="submit"
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

			<AlertComponent
				content={alertState.content}
				showing={alertState.show}
				setShowing={setAlertState}
			/>
		</div>
	)
}

export default LoginPage
