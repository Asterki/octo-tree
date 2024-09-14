import * as React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

interface Routine {
	name: string
	execution: 'manual' | 'automated'
	automatedExecution?: {
		condition:
			| 'temperatureexceeds'
			| 'temperaturebelow'
			| 'humidityexceeds'
			| 'humiditybelow'
			| 'interval'
		conditionValue: number | string
		checkInterval?: number
	}
	actions: {
		type: 'water' | 'rotatepanel' | 'notify'
		amount?: number
	}[]
}

const Routines = () => {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const [routines, setRoutines] = React.useState<Routine[]>([
		{
			name: 'Routine 1',
			execution: 'manual',
			actions: [
				{
					type: 'water',
					amount: 200,
				},
				{
					type: 'rotatepanel',
				},
			],
		},
		{
			name: 'Routine 2',
			execution: 'automated',
			automatedExecution: {
				condition: 'temperatureexceeds',
				conditionValue: 30,
			},
			actions: [
				{
					type: 'notify',
				},
			],
		},
	])

	const [selectedRoutine, setSelectedRoutine] = React.useState<number>(0)

	React.useEffect(() => {
		;(async () => {
			// Check if the user is logged in
			if (!user) {
				// Get the user's data
				try {
					const response = await axios({
						url: `${
							import.meta.env.MODE === 'development'
								? import.meta.env.VITE_API_URL
								: ''
						}/api/accounts/me`,
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
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			{/* Navbar */}
			<Navbar />

			<main className="flex md:flex-row md:flex-wrap flex-col items-center md:items-stretch justify-center md:mt-16 mt-32">
				<div className="w-2/12 py-4 bg-neutral-200 min-h-screen box-border border-r-2 border-neutral-300">
					<h1 className="text-xl font-bold px-2">Current Routines</h1>
					{routines.map((routine, index) => (
						<div
							className={`px-2 w-full border-t border-t-neutral-300 hover:bg-neutral-300 transition-all cursor-pointer ${
								selectedRoutine == index ? 'bg-neutral-300' : ''
							}`}
							onClick={() => setSelectedRoutine(index)}
						>
							<h2>{routine.name}</h2>
							<p>{routine.execution}</p>
						</div>
					))}
				</div>
				<div className="w-2/12">Hey there</div>
				<div className="w-8/12">
					Selected Routine: {routines[selectedRoutine].name}
				</div>
			</main>
		</div>
	)
}

export default Routines
