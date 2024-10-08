import * as React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import AlertComponent from '../components/alert'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'
import { useTranslation } from 'react-i18next'

import type { Routine } from '../types'

const Routines = () => {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()
	const { t } = useTranslation('common')

	const [routines, setRoutines] = React.useState<Routine[]>([])

	const [selectedRoutine, setSelectedRoutine] = React.useState<number>(-1)

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

	const fetchRoutines = async () => {
		// Get the routines
		const routinesResponse = await axios({
			url: `${
				import.meta.env.MODE === 'development'
					? import.meta.env.VITE_API_URL
					: ''
			}/api/routines/get`,
			method: 'get',
			withCredentials: true,
		})

		setRoutines(routinesResponse.data.routines)
		setSelectedRoutine(-1)
	}

	const updateRoutine = async () => {
		if (selectedRoutine === -1) return
		const routine = routines[selectedRoutine]

		try {
			await axios({
				url: `${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/routines/update`,
				method: 'post',
				data: {
					routine_id: routine.id,
					board_id: routine.boardId as string,
					routine,
				},
				withCredentials: true,
			})

			await fetchRoutines()

			showAlert(t('routines.routineUpdated'))
		} catch (error) {
			showAlert(t('routines.couldNotUpdate'))
		}
	}

	const deleteRoutine = async () => {
		if (selectedRoutine === -1) return

		const routine_id = routines[selectedRoutine].id
		setSelectedRoutine(-1)
		try {
			await axios({
				url: `${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/routines/delete`,
				method: 'post',
				data: {
					routine_id,
				},
				withCredentials: true,
			})

			await fetchRoutines()

			showAlert(t('routines.routineDeleted'))
		} catch (error) {
			showAlert(t('routines.couldNotDelete'))
		}
	}

	const createRoutine = async () => {
		setSelectedRoutine(-1)

		try {
			const newRoutine = {
				routine: {
					name: 'New Routine',
					execution: 'manual',
					actions: {
						notify: {
							active: false,
						},
						rotatePanel: {
							active: false,
						},
						water: {
							active: false,
							amount: 0,
						},
					},
					automatedExecution: {
						conditions: {
							humidityBelow: {
								active: false,
								value: 0,
							},
							humidityExceeds: {
								active: false,
								value: 0,
							},
							temperatureBelow: {
								active: false,
								value: 0,
							},
							temperatureExceeds: {
								active: false,
								value: 0,
							},
						},
						checkInterval: 10,
						nextExecutionInterval: new Date(
							Date.now() + 10 * 1000 * 60 // 10 minutes
						).toISOString(),
					},
				},
			}

			await axios({
				url: `${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/routines/create`,
				method: 'post',
				data: newRoutine, // Directly send newRoutine
				withCredentials: true,
			})

			await fetchRoutines()

			showAlert(t('routines.routineCreated'))
		} catch (error) {
			showAlert(t('routines.couldNotCreateRoutine'))
		}
	}

	React.useEffect(() => {
		;(async () => {
			console.log(user)
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

					dispatch(setUser(response.data.user))
				} catch (error) {
					navigate('/login')
				}
			}

			// Get the routines
			await fetchRoutines()
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600 dark:bg-gray-700 dark:text-white">
			{/* Navbar */}
			<Navbar />

			<main className="flex md:flex-row md:flex-wrap flex-col items-center md:items-stretch justify-center md:mt-16 mt-32">
				<div className="border-b-2 md:border-b-0 md:w-2/12 w-full h-64 overflow-y-scroll py-4 bg-neutral-200 dark:bg-gray-700 dark:text-white md:min-h-screen box-border border-r-2 border-neutral-300 dark:border-gray-600 flex flex-col itmes-center">
					<h1 className="text-xl font-bold px-2">
						{t('routines.currentRoutines')}
					</h1>
					{routines.length !== 0 &&
						routines.map((routine, index) => (
							<div
								key={routine.id}
								className={`px-2 w-full border-t border-t-neutral-300 dark:border-t-gray-600 hover:bg-neutral-300 hover:dark:bg-gray-600 transition-all cursor-pointer ${
									selectedRoutine == index
										? 'bg-neutral-300 dark:bg-gray-600'
										: ''
								}`}
								onClick={() => setSelectedRoutine(index)}
							>
								<h2 className="font-semibold">
									{routine.name}
								</h2>
								<p>{routine.execution}</p>
							</div>
						))}

					<button
						className="bg-emerald-500 text-white px-2 py-1 rounded-md mt-2 mx-4"
						onClick={createRoutine}
					>
						{t('routines.addRoutine')}
					</button>
				</div>

				{selectedRoutine === -1 && (
					<div className="md:w-10/12 w-full py-4 min-h-screen">
						<h1 className="text-xl font-bold px-2">
							{t('routines.selectRoutine')}
						</h1>
					</div>
				)}

				{selectedRoutine !== -1 && (
					<div className="w-10/12 py-4 min-h-screen">
						<h1 className="text-xl font-bold px-2">
							{t('routines.name')}
						</h1>
						<div className="px-2">
							<input
								className="dark:bg-gray-600 dark:text-white"
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

						<h1 className="text-xl font-bold px-2">
							{t('routines.active')}
						</h1>
						<div className="px-2 flex gap-2 items-center justify-start">
							<input
								type="checkbox"
								checked={routines[selectedRoutine].active}
								onChange={(e) => {
									const newRoutines = [...routines]
									newRoutines[selectedRoutine].active =
										e.target.checked
									setRoutines(newRoutines)
								}}
								className="dark:bg-gray-600 dark:text-white"
							/>
							<p>
								{routines[selectedRoutine].active
									? t('routines.active')
									: t('routines.inactive')}
							</p>
						</div>

						<br />

						<h1 className="text-xl font-bold px-2">
							{t('routines.execution')}
						</h1>
						<div className="px-2">
							<select
								value={routines[selectedRoutine].execution}
								onChange={(e) => {
									const newRoutines = [...routines]
									newRoutines[selectedRoutine].execution = e
										.target.value as 'manual' | 'automated'
									setRoutines(newRoutines)
								}}
								className="dark:bg-gray-600 dark:text-white"
							>
								<option value="manual">
									{t('routines.manual')}
								</option>
								<option value="automated">
									{t('routines.automated')}
								</option>
							</select>
						</div>

						<br />

						<h1 className="text-xl font-bold px-2">
							{t('routines.conditions')}
						</h1>
						<div className="px-2">
							{routines[selectedRoutine].execution ===
							'automated' ? (
								<>
									<p>{t('routines.noConditions')}</p>
									<p>{t('routines.multipleConditions')}</p>

									<br />

									<div>
										<input
											type="checkbox"
											checked={
												routines[selectedRoutine]
													.automatedExecution
													?.conditions
													.temperatureExceeds.active
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.temperatureExceeds.active =
													e.target.checked
												setRoutines(newRoutines)
											}}
											className="mr-2 dark:bg-gray-600 dark:text-white"
										/>
										<label className="font-bold">
											{t('routines.temperatureAbove')}
										</label>

										<br />

										{routines[selectedRoutine]
											.automatedExecution?.conditions
											.temperatureExceeds.active && (
											<input
												className="dark:bg-gray-600 dark:text-white"
												type="number"
												value={
													routines[selectedRoutine]
														.automatedExecution
														?.conditions
														.temperatureExceeds
														.value
												}
												onChange={(e) => {
													const newRoutines = [
														...routines,
													]
													newRoutines[
														selectedRoutine
													].automatedExecution!.conditions.temperatureExceeds.value =
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
													.automatedExecution
													?.conditions
													.temperatureBelow.active
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.temperatureBelow.active =
													e.target.checked
												setRoutines(newRoutines)
											}}
											className="mr-2 dark:bg-gray-600 dark:text-white"
										/>
										<label className="font-bold">
											{t('routines.temperatureBelow')}
										</label>

										<br />

										{routines[selectedRoutine]
											.automatedExecution?.conditions
											.temperatureBelow.active && (
											<input
												className="dark:bg-gray-600 dark:text-white"
												type="number"
												value={
													routines[selectedRoutine]
														.automatedExecution
														?.conditions
														.temperatureBelow.value
												}
												onChange={(e) => {
													const newRoutines = [
														...routines,
													]
													newRoutines[
														selectedRoutine
													].automatedExecution!.conditions.temperatureBelow.value =
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
													.automatedExecution
													?.conditions.humidityExceeds
													.active
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.humidityExceeds.active =
													e.target.checked
												setRoutines(newRoutines)
											}}
											className="mr-2 dark:bg-gray-600 dark:text-white"
										/>
										<label className="font-bold">
											{t('routines.humidityAbove')}
										</label>

										<br />

										{routines[selectedRoutine]
											.automatedExecution?.conditions
											.humidityExceeds.active && (
											<input
												className="dark:bg-gray-600 dark:text-white"
												type="number"
												value={
													routines[selectedRoutine]
														.automatedExecution
														?.conditions
														.humidityExceeds.value
												}
												onChange={(e) => {
													const newRoutines = [
														...routines,
													]
													newRoutines[
														selectedRoutine
													].automatedExecution!.conditions.humidityExceeds.value =
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
													.automatedExecution
													?.conditions.humidityBelow
													.active
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
												newRoutines[
													selectedRoutine
												].automatedExecution!.conditions.humidityBelow.active =
													e.target.checked
												setRoutines(newRoutines)
											}}
											className="mr-2 dark:bg-gray-600 dark:text-white"
										/>

										<label className="font-bold">
											{t('routines.humidityBelow')}
										</label>

										<br />

										{routines[selectedRoutine]
											.automatedExecution?.conditions
											.humidityBelow.active && (
											<input
												className="dark:bg-gray-600 dark:text-white"
												type="number"
												value={
													routines[selectedRoutine]
														.automatedExecution
														?.conditions
														.humidityBelow.value
												}
												onChange={(e) => {
													const newRoutines = [
														...routines,
													]
													newRoutines[
														selectedRoutine
													].automatedExecution!.conditions.humidityBelow.value =
														parseInt(e.target.value)
													setRoutines(newRoutines)
												}}
											/>
										)}
									</div>

									<br />

									<div>
										<label className="font-bold">
											{t('routines.checkInterval')}
										</label>{' '}
										<p>
											{t(
												'routines.checkIntervalRecommendation'
											)}
										</p>
										<input
											className="dark:bg-gray-600 dark:text-white"
											type="number"
											value={
												routines[selectedRoutine]
													.automatedExecution
													?.checkInterval
											}
											onChange={(e) => {
												const newRoutines = [
													...routines,
												]
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
								<h2>{t('routines.manualExecution')}</h2>
							)}
						</div>

						<br />

						<h1 className="text-xl font-bold px-2">
							{t('routines.actions')}
						</h1>
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
										].actions.water.active =
											e.target.checked
										setRoutines(newRoutines)
									}}
									className="mr-2 dark:bg-gray-600 dark:text-white"
								/>
								<label className="font-bold">
									{t('routines.water')}
								</label>
								<br />
								{routines[selectedRoutine].actions.water
									.active && (
									<input
										className="dark:bg-gray-600 dark:text-white"
										type="number"
										value={
											routines[selectedRoutine].actions
												.water.amount
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
											.rotatePanel.active
									}
									onChange={(e) => {
										const newRoutines = [...routines]
										newRoutines[
											selectedRoutine
										].actions.rotatePanel.active =
											e.target.checked
										setRoutines(newRoutines)
									}}
									className="mr-2 dark:bg-gray-600 dark:text-white"
								/>
								<label className="font-bold">
									{t('routines.rotatePanel')}
								</label>
								<br />
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
										].actions.notify.active =
											e.target.checked
										setRoutines(newRoutines)
									}}
									className="mr-2 dark:bg-gray-600 dark:text-white"
								/>
								<label className="font-bold">
									{t('routines.notify')}
								</label>

								<br />

								<p>{t('routines.notifyDescription')}</p>
							</div>
						</div>

						<br />

						<button
							className="bg-red-500 text-white px-2 py-1 rounded-md mt-2 mx-4"
							onClick={() => {
								deleteRoutine()
							}}
						>
							{t('routines.deleteRoutine')}
						</button>
					</div>
				)}
			</main>

			{/* Save button */}
			{selectedRoutine !== -1 && (
				<footer className="fixed bottom-0 w-full bg-neutral-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-4 border-t-2 border-t-neutral-300 flex items-end justify-end">
					<button
						className="bg-emerald-500 text-white px-2 py-1 rounded-md mt-2 mx-4 text-xl"
						onClick={() => updateRoutine()}
					>
						{t('routines.saveChanges')}
					</button>
				</footer>
			)}

			<AlertComponent
				content={alertState.content}
				showing={alertState.show}
				setShowing={setAlertState}
			/>
		</div>
	)
}

export default Routines
