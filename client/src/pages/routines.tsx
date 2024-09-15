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
		conditions: {
			temperatureexceeds: {
				active: boolean
				value: number
			}
			temperaturebelow: {
				active: boolean
				value: number
			}
			humidityexceeds: {
				active: boolean
				value: number
			}
			humiditybelow: {
				active: boolean
				value: number
			}
		}
		checkInterval: number
	}
	actions: {
		water: {
			active: boolean
			amount: number
		}
		rotatepanel: {
			active: boolean
			amount: number
		}
		notify: {
			active: boolean
		}
	}
}

const Routines = () => {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const [routines, setRoutines] = React.useState<Routine[]>([
		{
			name: 'Routine 1',
			execution: 'manual',
			actions: {
				water: {
					active: true,
					amount: 50,
				},
				rotatepanel: {
					active: false,
					amount: 90,
				},
				notify: {
					active: false,
				},
			},
		},
		{
			name: 'Routine 2',
			execution: 'automated',
			automatedExecution: {
				conditions: {
					temperatureexceeds: {
						active: true,
						value: 30,
					},
					temperaturebelow: {
						active: false,
						value: 20,
					},
					humiditybelow: {
						active: false,
						value: 30,
					},
					humidityexceeds: {
						active: true,
						value: 80,
					},
				},
				checkInterval: 5,
			},
			actions: {
				water: {
					active: true,
					amount: 50,
				},
				rotatepanel: {
					active: false,
					amount: 90,
				},
				notify: {
					active: false,
				},
			},
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
				<div className="w-2/12 py-4 bg-neutral-200 min-h-screen box-border border-r-2 border-neutral-300 flex flex-col itmes-center">
					<h1 className="text-xl font-bold px-2">Current Routines</h1>
					{routines.map((routine, index) => (
						<div
							className={`px-2 w-full border-t border-t-neutral-300 hover:bg-neutral-300 transition-all cursor-pointer ${
								selectedRoutine == index ? 'bg-neutral-300' : ''
							}`}
							onClick={() => setSelectedRoutine(index)}
						>
							<h2 className="font-semibold">{routine.name}</h2>
							<p>{routine.execution}</p>
						</div>
					))}

					<button
						className="bg-emerald-500 text-white px-2 py-1 rounded-md mt-2 mx-4"
						onClick={() => {
							const newRoutines = [...routines]
							newRoutines.push({
								name: 'New Routine',
								execution: 'manual',
								actions: {
									water: {
										active: false,
										amount: 50,
									},
									rotatepanel: {
										active: false,
										amount: 90,
									},
									notify: {
										active: false,
									},
								},
							})
							setRoutines(newRoutines)
						}}
					>
						Add Routine
					</button>
				</div>
				<div className="w-10/12 py-4 min-h-screen">
					<h1 className="text-xl font-bold px-2">Name</h1>
					<div className="px-2">
						<input
							type="text"
							value={routines[selectedRoutine].name}
							onChange={(e) => {
								const newRoutines = [...routines]
								newRoutines[selectedRoutine].name =
									e.target.value
								setRoutines(newRoutines)
							}}
						/>
					</div>

					<br />

					<h1 className="text-xl font-bold px-2">Execution</h1>
					<div className="px-2">
						<select
							value={routines[selectedRoutine].execution}
							onChange={(e) => {
								const newRoutines = [...routines]
								newRoutines[selectedRoutine].execution = e
									.target.value as 'manual' | 'automated'
								setRoutines(newRoutines)
							}}
						>
							<option value="manual">Manual</option>
							<option value="automated">Automated</option>
						</select>
					</div>

					<br />

					<h1 className="text-xl font-bold px-2">Conditions</h1>
					<div className="px-2">
						{routines[selectedRoutine].execution === 'automated' ? (
							<>
								<p>
									If no conditions are set, the routine will
									execute every check interval.
								</p>
								<p>
									If more than one condition is set, the
									routine will execute if any of the
									conditions are met.
								</p>

								<br />

								<div>
									<input
										type="checkbox"
										checked={
											routines[selectedRoutine]
												.automatedExecution?.conditions
												.temperatureexceeds.active
										}
										onChange={(e) => {
											const newRoutines = [...routines]
											newRoutines[
												selectedRoutine
											].automatedExecution!.conditions.temperatureexceeds.active =
												e.target.checked
											setRoutines(newRoutines)
										}}
										className="mr-2"
									/>
									<label className="font-bold">
										Temperature Above *C°
									</label>

									<br />

									{routines[selectedRoutine]
										.automatedExecution?.conditions
										.temperatureexceeds.active && (
										<input
											type="number"
											value={
												routines[selectedRoutine]
													.automatedExecution
													?.conditions
													.temperatureexceeds.value
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.temperatureexceeds.value =
													parseInt(e.target.value)
												setRoutines(newRoutines)
											}}
										/>
									)}
								</div>

								<br />

								<div>
									<input
										type="checkbox"
										checked={
											routines[selectedRoutine]
												.automatedExecution?.conditions
												.temperaturebelow.active
										}
										onChange={(e) => {
											const newRoutines = [...routines]
											newRoutines[
												selectedRoutine
											].automatedExecution!.conditions.temperaturebelow.active =
												e.target.checked
											setRoutines(newRoutines)
										}}
										className="mr-2"
									/>
									<label className="font-bold">
										Temperature Below *C°
									</label>

									<br />

									{routines[selectedRoutine]
										.automatedExecution?.conditions
										.temperaturebelow.active && (
										<input
											type="number"
											value={
												routines[selectedRoutine]
													.automatedExecution
													?.conditions
													.temperaturebelow.value
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.temperaturebelow.value =
													parseInt(e.target.value)
												setRoutines(newRoutines)
											}}
										/>
									)}
								</div>

								<br />

								<div>
									<input
										type="checkbox"
										checked={
											routines[selectedRoutine]
												.automatedExecution?.conditions
												.humidityexceeds.active
										}
										onChange={(e) => {
											const newRoutines = [...routines]
											newRoutines[
												selectedRoutine
											].automatedExecution!.conditions.humidityexceeds.active =
												e.target.checked
											setRoutines(newRoutines)
										}}
										className="mr-2"
									/>
									<label className="font-bold">
										Humidity Above *%
									</label>

									<br />

									{routines[selectedRoutine]
										.automatedExecution?.conditions
										.humidityexceeds.active && (
										<input
											type="number"
											value={
												routines[selectedRoutine]
													.automatedExecution
													?.conditions.humidityexceeds
													.value
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.humidityexceeds.value =
													parseInt(e.target.value)
												setRoutines(newRoutines)
											}}
										/>
									)}
								</div>

								<br />

								<div>
									<input
										type="checkbox"
										checked={
											routines[selectedRoutine]
												.automatedExecution?.conditions
												.humiditybelow.active
										}
										onChange={(e) => {
											const newRoutines = [...routines]
											newRoutines[
												selectedRoutine
											].automatedExecution!.conditions.humiditybelow.active =
												e.target.checked
											setRoutines(newRoutines)
										}}
										className="mr-2"
									/>

									<label className="font-bold">
										Humidity Below *%
									</label>

									<br />

									{routines[selectedRoutine]
										.automatedExecution?.conditions
										.humiditybelow.active && (
										<input
											type="number"
											value={
												routines[selectedRoutine]
													.automatedExecution
													?.conditions.humiditybelow
													.value
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.humiditybelow.value =
													parseInt(e.target.value)
												setRoutines(newRoutines)
											}}
										/>
									)}
								</div>

								<br />

								<div>
									<label className="font-bold">
										Check Interval (Minutes)
									</label>{' '}
									<p>
										It is recommended to have at least 30
										minutes per check interval.
									</p>
									<input
										type="number"
										value={
											routines[selectedRoutine]
												.automatedExecution
												?.checkInterval
										}
										onChange={(e) => {
											const newRoutines = [...routines]
											newRoutines[
												selectedRoutine
											].automatedExecution!.checkInterval =
												parseInt(e.target.value)
											setRoutines(newRoutines)
										}}
									/>
								</div>
							</>
						) : (
							<h2>Manual Execution</h2>
						)}
					</div>

					<br />

					<h1 className="text-xl font-bold px-2">Actions</h1>
					<div className="px-2">
						<div>
							<input
								type="checkbox"
								checked={
									routines[selectedRoutine].actions.water
										.active
								}
								onChange={(e) => {
									const newRoutines = [...routines]
									newRoutines[
										selectedRoutine
									].actions.water.active = e.target.checked
									setRoutines(newRoutines)
								}}
								className="mr-2"
							/>
							<label className="font-bold">Water</label>
							<br />
							{routines[selectedRoutine].actions.water.active && (
								<input
									type="number"
									value={
										routines[selectedRoutine].actions.water
											.amount
									}
									onChange={(e) => {
										const newRoutines = [...routines]
										newRoutines[
											selectedRoutine
										].actions.water.amount = parseInt(
											e.target.value
										)
										setRoutines(newRoutines)
									}}
								/>
							)}
						</div>

						<br />

						<div>
							<input
								type="checkbox"
								checked={
									routines[selectedRoutine].actions
										.rotatepanel.active
								}
								onChange={(e) => {
									const newRoutines = [...routines]
									newRoutines[
										selectedRoutine
									].actions.rotatepanel.active =
										e.target.checked
									setRoutines(newRoutines)
								}}
								className="mr-2"
							/>
							<label className="font-bold">Rotate Panel</label>
							<br />
							{routines[selectedRoutine].actions.rotatepanel
								.active && (
								<input
									type="number"
									value={
										routines[selectedRoutine].actions
											.rotatepanel.amount
									}
									onChange={(e) => {
										const newRoutines = [...routines]
										newRoutines[
											selectedRoutine
										].actions.rotatepanel.amount = parseInt(
											e.target.value
										)
										setRoutines(newRoutines)
									}}
								/>
							)}
						</div>

						<br />

						<div>
							<input
								type="checkbox"
								checked={
									routines[selectedRoutine].actions.notify
										.active
								}
								onChange={(e) => {
									const newRoutines = [...routines]
									newRoutines[
										selectedRoutine
									].actions.notify.active = e.target.checked
									setRoutines(newRoutines)
								}}
								className="mr-2"
							/>
							<label className="font-bold">Notify</label>

							<br />

							<p>
								You will be notified if the routine is executed.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default Routines
