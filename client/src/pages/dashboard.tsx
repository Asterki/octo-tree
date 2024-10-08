import * as React from 'react'
import { Socket, io } from 'socket.io-client'
import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import AlertComponent from '../components/alert'

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faCheck,
	faPlantWilt,
	faSolarPanel,
	faTimes,
} from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from 'react-i18next'

import type { Routine } from '../types'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export const options = {
	responsive: true,
	interaction: {
		mode: 'index' as const,
		intersect: true,
	},
	scales: {
		x: {
			stacked: false,
		},
		y: {
			stacked: true,
		},
	},
}

const Dashboard = () => {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()
	const { t } = useTranslation('common')

	const [socket, setSocket] = React.useState<Socket | null>(null)
	const [alertState, setAlertState] = React.useState({
		show: false,
		content: '',
	})

	const [imageAnalysis, setImageAnalysis] = React.useState<{
		showing: boolean
		confidence: number
		name: string
		description: string
	}>({
		showing: false,
		confidence: 0,
		name: '',
		description: '',
	})

	const [routines, setRoutines] = React.useState<Routine[]>([])
	const [currentChat, setCurrentChat] = React.useState([
		{
			author: 'Octo-Tree',
			message: t('dashboard.octoTreeFirstMessage'),
		},
	])

	const [currentTimeLabels, setCurrentTimeLabels] = React.useState(
		[] as string[]
	)
	const [temperatureData, setTemperatureData] = React.useState<number[]>([])
	const [humidityData, setHumidityData] = React.useState<number[]>([])

	const panelImageInputRef = React.useRef<HTMLInputElement>(null)
	const soilImageInputRef = React.useRef<HTMLInputElement>(null)
	const aiQuestionInputRef = React.useRef<HTMLInputElement>(null)
	const analysisResultImageRef = React.useRef<HTMLImageElement>(null)

	const executeRoutine = async (routineID: number) => {
		try {
			const response = await axios.post(
				`${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/routines/execute`,
				{
					routine_id: routineID,
				},
				{
					withCredentials: true,
				}
			)

			if (response.data.status == 'success') {
				showAlert(t('dashboard.routineExecuted'))
			}
		} catch (error) {
			showAlert(t('dashboard.errorExecutingRoutine'))
		}
	}

	const uploadImage = (type: 'soil' | 'panel') => {
		const input = type == 'soil' ? soilImageInputRef : panelImageInputRef
		const file = (input.current as HTMLInputElement).files?.[0]

		// Check if there's a file
		if (!file) {
			return
		}

		const formData = new FormData()
		formData.append(`${type}image`, file as Blob)

		axios
			.post(
				`${
					import.meta.env.MODE === 'development'
						? import.meta.env.VITE_API_URL
						: ''
				}/api/analysis/${type}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					withCredentials: true,
				}
			)
			.then(async (response) => {
				// Load the language variables because i18 only supports lazy loading
				const languages = {
					en: await import('../translations/en/common.json'),
					es: await import('../translations/es/common.json'),
					fr: await import('../translations/fr/common.json'),
					de: await import('../translations/de/common.json'),
				}

				const language =
					// @ts-expect-error ewjqioejqwioe
					languages[navigator!.language!.split('-')![0]!]!

				// Load the image in the analysis result
				const reader = new FileReader()
				reader.onload = () => {
					analysisResultImageRef.current!.src =
						reader.result as string
				}

				reader.readAsDataURL(file as Blob)

				setImageAnalysis({
					showing: true,
					confidence: response.data.analysis[0].confidence,
					name: language.dashboard[
						`imgres-${response.data.analysis[0].name}`
					],
					description:
						language.dashboard[
							`imgres-${response.data.analysis[0].name}-desc`
						],
				});

				// Clear the file input
				(input.current as HTMLInputElement).value = '';
			})
	}

	const askQuestionToAI = async () => {
		const question = aiQuestionInputRef.current!.value

		if (question?.length < 8 || question?.length > 256) {
			showAlert(t('dashboard.invalidQuestion'))
			return
		}

		setCurrentChat((prevChat) => [
			...prevChat,
			{
				author: 'You',
				message: question,
			},
		])

		// Clear the input
		aiQuestionInputRef.current!.value = ''
		aiQuestionInputRef.current!.disabled = true

		const response = await axios.post(
			`${
				import.meta.env.MODE === 'development'
					? import.meta.env.VITE_API_URL
					: ''
			}/api/ai/ask`,
			{
				question,
				pastMessages: currentChat.slice(-10),
			},
			{
				withCredentials: true,
			}
		)

		setCurrentChat((prevChat) => [
			...prevChat,
			{
				author: 'Octo-Tree AI',
				message: response.data.result.choices[0].message.content,
			},
		])

		// Enable the input
		aiQuestionInputRef.current!.disabled = false
	}

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

					dispatch(setUser(response.data.user))
				} catch (error) {
					navigate('/login')
				}
			}

			// Get the current routines
			try {
				const response = await axios({
					url: `${
						import.meta.env.MODE === 'development'
							? import.meta.env.VITE_API_URL
							: ''
					}/api/routines/get`,
					method: 'get',
					withCredentials: true,
				})
				setRoutines(response.data.routines)
			} catch (error) {
				showAlert(t('dashboard.errorGettingRoutines'))
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	React.useEffect(() => {
		if (user) {
			const newSocket = io(
				import.meta.env.MODE === 'development'
					? import.meta.env.VITE_API_URL
					: '',
				{
					autoConnect: true,
				}
			)

			newSocket.on('connect', () => {
				console.log('Connected to server')
				setSocket(newSocket)

				setInterval(() => {
					newSocket.emit('get_sensor_data', {
						userID: (user as unknown as { id: string }).id,
						boardID: (
							user as unknown as { board: { id: string }[] }
						).board[0].id,
					})
				}, 5000)
			})

			newSocket.on('disconnect', () => {
				console.log('Disconnected from server')
				setSocket(null)
			})
		}
	}, [user])

	React.useEffect(() => {
		if (!socket) return

		socket.on('sensordata', (data) => {
			const parsedData = JSON.parse(data.data)

			const temperature = parsedData.temperature
			const humidity = parsedData.humidity

			setTemperatureData((prevTemperatureData) => {
				if (prevTemperatureData.length >= 10) {
					return [...prevTemperatureData.slice(1), temperature]
				} else {
					return [...prevTemperatureData, temperature]
				}
			})

			setHumidityData((prevHumidityData) => {
				if (prevHumidityData.length >= 10) {
					return [...prevHumidityData.slice(1), humidity]
				} else {
					return [...prevHumidityData, humidity]
				}
			})

			setCurrentTimeLabels((prevTimeLabels) => {
				if (prevTimeLabels.length >= 10) {
					return [
						...prevTimeLabels.slice(1),
						new Date().toLocaleTimeString(),
					]
				} else {
					return [...prevTimeLabels, new Date().toLocaleTimeString()]
				}
			})
		})

		return () => {
			socket.off('sensordata')
		}
	}, [socket])

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600 dark:text-white dark:bg-gray-700">
			{/* Navbar */}
			<Navbar />

			{imageAnalysis.showing && (
				<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50 ">
					<div className="bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-4 md:w-1/2 w-11/12">
						<h1 className="text-2xl text-center font-bold">
							{t('dashboard.analysisResult')}
						</h1>
						<p>
							<img
								src=""
								ref={analysisResultImageRef}
								alt=""
								className="w-full h-96 object-cover rounded-md"
							/>
							<b>{t('dashboard.analysis')}:</b>{' '}
							{imageAnalysis.name} (
							{(imageAnalysis.confidence * 100).toFixed(2)}%{' '}
							{t('dashboard.confidence')})
							<br />
							<br />
							<b>{t('dashboard.description')}:</b>{' '}
							{imageAnalysis.description}
						</p>

						<button
							className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md my-2 text-center"
							onClick={() =>
								setImageAnalysis({
									showing: false,
									confidence: 0,
									name: '',
									description: '',
								})
							}
						>
							{t('dashboard.close')}
						</button>
					</div>
				</div>
			)}

			<main className="flex md:flex-row md:flex-wrap flex-col items-center md:items-stretch gap-2 justify-center md:mt-16 mt-32 py-8">
				<div className="w-full text-center">
					{user && (
						<p className="text-2xl">
							{t('dashboard.welcome')}{' '}
							<b className="md:block hidden">
								{(user as { email: string }).email}
							</b>
						</p>
					)}
				</div>

				<section className="w-11/12 flex flex-col items-center justify-start gap-2 rounded-md shadow-lg bg-white dark:bg-gray-800 dark:text-white p-4 md:w-1/3 md:my-0 my-2">
					<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
						{t('dashboard.connectionStatus')}
					</h1>
					<div
						className={`${
							socket == null ? 'bg-red-500' : 'bg-green-500'
						} rounded-full h-16 w-16 flex items-center justify-center`}
					>
						<FontAwesomeIcon
							icon={socket !== null ? faCheck : faTimes}
							className="text-2xl text-white"
						/>
					</div>
					<p className="text-center">
						{socket !== null
							? t('dashboard.connected')
							: t('dashboard.disconnected')}
					</p>
				</section>

				<section className="w-11/12 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 md:w-7/12">
					<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
						{t('dashboard.soilSolarPanelAnalysis')}
					</h1>

					<input
						type="file"
						accept="image/*"
						ref={soilImageInputRef}
						className="hidden"
						onChange={() => uploadImage('soil')}
					/>
					<input
						type="file"
						accept="image/*"
						ref={panelImageInputRef}
						className="hidden"
						onChange={() => uploadImage('panel')}
					/>

					<div className="flex gap-2">
						<button
							className="h-32 w-1/2 rounded-md bg-neutral-200 dark:bg-gray-600 flex flex-col items-center justify-center"
							onClick={() => soilImageInputRef.current?.click()}
						>
							<FontAwesomeIcon
								icon={faPlantWilt}
								className="text-3xl"
							/>
							{t('dashboard.detectSoilType')}
						</button>
						<button
							className="h-32 w-1/2 rounded-md bg-neutral-200 dark:bg-gray-600 flex flex-col items-center justify-center"
							onClick={() => panelImageInputRef.current?.click()}
						>
							<FontAwesomeIcon
								icon={faSolarPanel}
								className="text-3xl"
							/>
							{t('dashboard.detectSolarPanelDamages')}
						</button>
					</div>
				</section>

				<section className="w-11/12 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 my-2 md:w-[calc(91.66%+0.6rem)]">
					<div>
						<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
							{t('dashboard.aiChatTitle')}
						</h1>
						<p className="text-center">
							{t('dashboard.aiChatDescription')}
						</p>
					</div>
					<div className="gap-2 w-full h-96 overflow-y-scroll overflow-x-hidden md:px-32 px-2 my-2">
						{currentChat.map((chat, index) => (
							<div key={index} className="gap-2 my-2">
								<p>
									<b>{chat.author}: </b> <br /> {chat.message}
								</p>
							</div>
						))}
					</div>
					<div className="flex items-center justify-center w-full gap-2 md:px-32 px-2">
						<input
							type="text"
							ref={aiQuestionInputRef}
							placeholder={t('dashboard.enterYourMessage')}
							className="p-2 border border-neutral-200 dark:border-gray-600 dark:bg-gray-600 rounded-md w-full focus:border-emerald-600 dark:focus:border-emerald-500 transition-all dark:outline-emerald-500 outline-emerald-600"
						/>
						<button
							className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md my-2 w-2/12 md:w-3/12"
							onClick={askQuestionToAI}
						>
							{t('dashboard.send')}
						</button>
						<button
							className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md my-2 w-2/12 md:w-3/12"
							onClick={() => setCurrentChat([])}
						>
							{t('dashboard.clearChat')}
						</button>
					</div>
				</section>

				<section className="w-11/12 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg relative flex flex-col p-2 my-2 md:w-3/12">
					<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
						{t('dashboard.currentRoutines')}
					</h1>

					<Link
						to="/routines"
						className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md my-2 block text-center"
					>
						{t('dashboard.addRoutine')}
					</Link>

					<div className="overflow-y-scroll w-full flex h-full flex-col">
						{routines.length != 0 &&
							routines.map((routine, index) => (
								<div
									key={index}
									className="flex items-center justify-between gap-2 p-2 rounded-md bg-neutral-100 dark:bg-gray-700 my-2"
								>
									<p>
										{routine.name} ({routine.execution})
									</p>
									<div className="flex gap-2">
										<button
											className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md"
											onClick={() =>
												executeRoutine(routine.id)
											}
										>
											{t('dashboard.execute')}
										</button>
									</div>
								</div>
							))}

						{routines.length === 0 && (
							<div className="flex items-center justify-between gap-2 p-2 rounded-md bg-neutral-100 dark:bg-gray-700">
								<p>{t('dashboard.noRoutines')}</p>
							</div>
						)}
					</div>
				</section>

				<section className="w-11/12 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 my-2 md:w-4/12">
					<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
						{t('dashboard.temperature')}
					</h1>
					<Line
						options={options}
						data={{
							labels: currentTimeLabels,
							datasets: [
								{
									label: t('dashboard.temperature'),
									data: temperatureData,
									backgroundColor: 'rgb(255, 99, 132)',
								},
							],
						}}
					/>
				</section>

				<section className="w-11/12 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-lg p-2 my-2 md:w-4/12">
					<h1 className="text-slate-700 dark:text-neutral-200 text-2xl text-center font-bold">
						{t('dashboard.humidity')}
					</h1>
					<Line
						options={options}
						data={{
							labels: currentTimeLabels,
							datasets: [
								{
									label: t('dashboard.humidity'),
									data: humidityData,
									backgroundColor: 'rgb(255, 99, 132)',
								},
							],
						}}
					/>
				</section>
			</main>

			<AlertComponent
				content={alertState.content}
				showing={alertState.show}
				setShowing={setAlertState}
			/>
		</div>
	)
}

export default Dashboard
