import * as React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import NavbarComponent from '../components/navbar'

const HomePage = () => {
	const navigate = useNavigate()

	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			<NavbarComponent />

			<main className="flex flex-col items-start justify-start h-full md:mt-16 mt-32">
				<section className="w-full">
					<div className=" text-gray-800 relative flex items-center justify-center h-[calc(100vh)] bg-[url('/wallpaper.jpg')] backdrop-blur-sm">
					

						<div className="absolute text-white px-10 w-full">
							<h1 className="text-5xl font-bold">
								The future of modular IoT starts here.
							</h1>

							<p className="w-5/12 px-4">
								Octo-Tree is a modular IoT platform that allows
								you to quickly and easily configure and deploy
								IoT solutions, all from within a web browser.
							</p>

							<p>
								<button
									onClick={() => navigate('/register')}
									className="bg-emerald-600 text-white px-4 py-2 rounded-md mt-4"
								>
									Get started
								</button>
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}

export default HomePage
