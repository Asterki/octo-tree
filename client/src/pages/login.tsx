import * as React from 'react'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import NavbarComponent from '../components/navbar'
import AlertComponent from '../components/alert'

import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
	const navigate = useNavigate()
	const { t } = useTranslation('common')

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
				showAlert(t('login.fillAllFields'))
				return
			}

			const response = await axios({
				url: `${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/accounts/login`,
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
					url: `${
						import.meta.env.MODE === 'development'
							? import.meta.env.VITE_API_URL
							: ''
					}/api/accounts/me`,
					method: 'GET',
					withCredentials: true,
				})

				dispatch(setUser(userResponse.data))
				navigate('/dashboard')
			}
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status == 401)
					showAlert(t('login.invalidCredentials'))
				else if (error.response?.status == 400)
					showAlert(t('login.fillAllFields'))
				else showAlert(t('login.somethingWentWrong'))
			} else {
				showAlert(t('login.somethingWentWrong'))
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
						url: `${
							import.meta.env.MODE === 'development'
								? import.meta.env.VITE_API_URL
								: ''
						}/api/accounts/me`,
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
					<h1 className="text-3xl font-bold text-center">
						{t('login.login')}
					</h1>
					<p className="text-center">{t('login.title')}</p>

					<div className="flex flex-col items-center mt-4">
						<input
							type="email"
							ref={emailRef}
							placeholder={t('login.email')}
							className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
						/>

						<input
							type="password"
							ref={passwordRef}
							placeholder={t('login.password')}
							className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
						/>
						<button
							type="submit"
							className="bg-emerald-700 text-white w-full p-2 rounded-md mt-4 hover:brightness-110 transition-all"
						>
							{t('login.login')}
						</button>
					</div>

					<p className="mt-2 text-center">
						{t("login.noAccountPreLink")}{' '}
						<Link to="/register" className="text-emerald-700">
							{t('login.noAccountLink')}
						</Link>
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
