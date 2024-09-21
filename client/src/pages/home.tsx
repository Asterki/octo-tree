import * as React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import NavbarComponent from '../components/navbar'

const HomePage = () => {
	const navigate = useNavigate()
	const { t } = useTranslation('common')

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	// Check if the user is already logged in
	React.useEffect(() => {
		;(async () => {
			if (!user) {
				// Get the user's data
				try {
					const response = await axios({
						url: `${
							import.meta.env.MODE === 'development'
								? import.meta.env.MODE === 'development'
									? import.meta.env.VITE_API_URL
									: ''
								: ''
						}/api/accounts/me`,
						method: 'get',
						withCredentials: true,
					})

					dispatch(setUser(response.data.user))
				} catch (error) {
					console.error(error)
				}
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="bg-neutral-100 md:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)] text-neutral-600">
			<NavbarComponent />

			<main className="flex flex-col items-start justify-start md:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)] md:mt-16 mt-32">
				<section className="w-full">
					<div className="text-gray-800 relative flex items-center justify-center md:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)] bg-gray-800">
						<video
							src="/bg.mp4"
							autoPlay
							muted
							loop
							className="absolute top-0 left-0 w-full h-full md:object-fill object-cover shadow-lg"
						></video>

						<div className="text-center md:text-left absolute text-white px-10 md:w-full">
							<h1 className="text-5xl font-bold">
								{t('home.title')}
							</h1>

							<p className="md:w-5/12">{t('home.description')}</p>

							<p>
								<button
									onClick={() => navigate('/dashboard')}
									className="bg-emerald-600 text-white px-4 py-2 rounded-md mt-4 shadow-md"
								>
									{user
										? t('home.buttons.dashboard')
										: t('home.buttons.getStarted')}
								</button>
							</p>
						</div>
					</div>
				</section>

				<section className="min-h-screen px-10 py-10 bg-white">
					<h2 className="text-4xl font-bold mb-6">
						{t('home.characteristics.title')}
					</h2>
					<p className="text-lg text-gray-600 mb-4">
						{t('home.characteristics.description')}
					</p>

					<div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
						<div className="bg-neutral-100 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
							<h3 className="text-2xl font-semibold mb-4">
								{t('home.characteristics.feature1.title')}
							</h3>
							<p className="text-gray-700">
								{t('home.characteristics.feature1.description')}
							</p>
							<img
								src="/img/f1.png"
								className='md:w-1/2 rounded-md text-center my-2 animate-pulse'
								alt=""
							/>
						</div>
						<div className="bg-neutral-100 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
							<h3 className="text-2xl font-semibold mb-4">
								{t('home.characteristics.feature2.title')}
							</h3>
							<p className="text-gray-700">
								{t('home.characteristics.feature2.description')}
							</p>
							<img
								src="/img/f2.png"
								className='md:w-1/2 rounded-md text-center my-2 animate-pulse'
								alt=""
							/>
						</div>
						<div className="bg-neutral-100 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
							<h3 className="text-2xl font-semibold mb-4">
								{t('home.characteristics.feature3.title')}
							</h3>
							<p className="text-gray-700">
								{t('home.characteristics.feature3.description')}
							</p>
							<img
								src="/img/f3.png"
								className='md:w-1/2 rounded-md text-center my-2 animate-pulse bg-white'
								alt=""
							/>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

export default HomePage
