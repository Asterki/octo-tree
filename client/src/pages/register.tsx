import * as React from 'react'
import axios from 'axios'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import { useNavigate } from 'react-router-dom'
import NavbarComponent from '../components/navbar'

const Register = () => {
	const navigate = useNavigate()

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const productIDRef = React.useRef<HTMLInputElement>(null)
	const emailRef = React.useRef<HTMLInputElement>(null)
	const passwordRef = React.useRef<HTMLInputElement>(null)
	const repeatPasswordRef = React.useRef<HTMLInputElement>(null)

	const register = async () => {
		const password = passwordRef.current?.value
		const repeatPassword = repeatPasswordRef.current?.value

		if (password !== repeatPassword) {
			return alert('Passwords do not match!')
		}

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/accounts/register`,
                {
                    productID: productIDRef.current?.value,
                    email: emailRef.current?.value,
                    password,
                },
                {
                    withCredentials: true,
                }
			)

			if (response.data.success == true) return navigate('/login')
			else alert('An error occurred')
		} catch (error) {
			console.error(error)
		}
	}

	React.useEffect(() => {
		;(async () => {
			if (user) {
				navigate('/dashboard')
			} else {
				// Get the user's data
				const response = await axios({
					url: `${import.meta.env.VITE_API_URL}/api/accounts/me`,
					method: 'get',
					withCredentials: true,
				})

				dispatch(setUser(response.data))
				navigate('/dashboard')
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			{/* Navbar */}
			<NavbarComponent />

			<main className="min-h-screen flex items-center justify-center">
				<form action="">
					<h1 className="text-3xl font-bold text-center">
						Register your account
					</h1>
					<div className="flex flex-col items-center mt-4">
						<input
							type="text"
							ref={productIDRef}
							placeholder="Product ID"
							className="p-2 border border-neutral-200 rounded-md w-80"
						/>
						<input
							type="email"
							ref={emailRef}
							placeholder="Email"
							className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
						/>
						<input
							type="password"
							ref={passwordRef}
							placeholder="Repeat Password"
							className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
						/>
						<input
							type="password"
							ref={repeatPasswordRef}
							placeholder="Password"
							className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
						/>
						<button
							type="button"
							onClick={register}
							className="bg-emerald-700 text-white w-80 p-2 rounded-md mt-4"
						>
							Register
						</button>
					</div>
				</form>
			</main>
		</div>
	)
}

export default Register
