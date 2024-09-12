import * as React from 'react'
import { Socket, io } from 'socket.io-client'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

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

function App() {
	const navigate = useNavigate()
	const user = useAppSelector((state) => state.page.user)
	const dispatch = useAppDispatch()

	const [socket, setSocket] = React.useState<Socket | null>(null)

	const [currentTimeLabels, setCurrentTimeLabels] = React.useState(
		[] as string[]
	)

	const [temperatureData, setTemperatureData] = React.useState<number[]>([])
	const [humidityData, setHumidityData] = React.useState<number[]>([])

	const [currentConfiguration, setCurrentConfiguration] = React.useState({
		panelAutoMode: false,
		routines: [],
	})

	const panelImageInputRef = React.useRef<HTMLInputElement>(null)
	const soilImageInputRef = React.useRef<HTMLInputElement>(null)

	const uploadImage = (type: 'soil' | 'panel') => {
		const input = type == 'soil' ? soilImageInputRef : panelImageInputRef
		const file = (input.current as HTMLInputElement).files?.[0]

		const formData = new FormData()
		formData.append(`${type}image`, file as Blob)

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/api/analysis/${type}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response)
			})
	}

	React.useEffect(() => {
		;(async () => {
			// Check if the user is logged in
			if (!user) {
				// Get the user's data
				try {
					const response = await axios({
						url: `${import.meta.env.VITE_API_URL}/api/accounts/me`,
						method: 'get',
						withCredentials: true,
					})

					dispatch(setUser(response.data))
				} catch (error) {
					navigate('/login')
				}
			}

			const newSocket = io(import.meta.env.VITE_API_URL, {
				autoConnect: true,
			})

			newSocket.on('connect', () => {
				console.log('Connected to server')
				setSocket(newSocket)

				setInterval(() => {
					newSocket.emit('getsensordata', {
						userID: '6c8378d7-cbc7-4ef2-aa92-76d155544d5e',
						boardID: '123123123',
						sensorShareToken: '123123123',
					})
				}, 500)
			})

			newSocket.on('disconnect', () => {
				console.log('Disconnected from server')
				setSocket(null)
			})
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			{/* Navbar */}
			<Navbar />

			<main className="flex md:flex-row md:flex-wrap flex-col items-center md:items-stretch gap-2 justify-center md:mt-24 mt-32">
				<section className="w-11/12 flex flex-col items-center justify-start gap-2 rounded-md shadow-lg bg-white p-4 md:w-1/3">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Connection Status
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
							? 'Connected to the server'
							: 'Disconnected from the host'}
					</p>
				</section>

				<section className="w-11/12 bg-white rounded-md shadow-lg p-2 my-2 md:w-7/12">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Soil & Solar Panel Analysis
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
							className="h-32 w-1/2 rounded-md bg-neutral-200"
							onClick={() => soilImageInputRef.current?.click()}
						>
							<FontAwesomeIcon
								icon={faPlantWilt}
								className="text-3xl"
							/>
						</button>
						<button
							className="h-32 w-1/2 rounded-md bg-neutral-200"
							onClick={() => panelImageInputRef.current?.click()}
						>
							<FontAwesomeIcon
								icon={faSolarPanel}
								className="text-3xl"
							/>
						</button>
					</div>
				</section>

				<section className="w-11/12 bg-white rounded-md shadow-lg p-2 my-2 md:w-3/12">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Panel Position & Orientation
					</h1>

					{/* Switch to auto mode */}
					<div className="flex flex-col items-center justify-center gap-2">
						<p>Auto Mode</p>
						<label className="switch">
							<input
								type="checkbox"
								onChange={(e) => {
									setCurrentConfiguration({
										...currentConfiguration,
										panelAutoMode: e.target.checked,
									})
								}}
								defaultChecked={
									currentConfiguration.panelAutoMode
								}
							/>
							<span className="slider round"></span>
						</label>

						<br />

						{!currentConfiguration.panelAutoMode && (
							<div>
								<p>Manual Mode</p>
								<input
									type="number"
									name=""
									id=""
									className="w-1/2 rounded-md border transition-all hover:border-emerald-600 outline-none"
									placeholder="0-90"
								/>
								<button className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md">
									Set Position
								</button>
							</div>
						)}

						{currentConfiguration.panelAutoMode && (
							<div>
								<p>Update Every</p>
								<input
									type="number"
									name=""
									id=""
									className="w-1/2 rounded-md border transition-all hover:border-emerald-600 outline-none"
									placeholder="0-90m"
								/>
								<button className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md">
									Set Interval
								</button>

							</div>
						)}
					</div>
				</section>

				<section className="w-11/12 bg-white rounded-md shadow-lg p-2 my-2 md:w-4/12">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Temperature
					</h1>
					<Line
						options={options}
						data={{
							labels: currentTimeLabels,
							datasets: [
								{
									label: 'Temperature',
									data: temperatureData,
									backgroundColor: 'rgb(255, 99, 132)',
								},
							],
						}}
					/>
				</section>

				<section className="w-11/12 bg-white rounded-md shadow-lg p-2 md:w-4/12">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Humidity
					</h1>
					<Line
						options={options}
						data={{
							labels: currentTimeLabels,
							datasets: [
								{
									label: 'Humidity',
									data: humidityData,
									backgroundColor: 'rgb(255, 99, 132)',
								},
							],
						}}
					/>
				</section>

				{/* <section className="w-11/12 bg-white rounded-md shadow-lg p-2 my-2">
					<h1 className="text-slate-700 text-2xl text-center font-bold">
						Current Routines
					</h1>

					<div className="flex flex-col gap-2">
						{currentConfiguration.routines.map((routine, index) => (
							<div
								key={index}
								className="flex items-center justify-between gap-2 p-2 rounded-md bg-neutral-200"
							>
								<p>{routine.name}</p>
								<div className="flex gap-2">
									<button className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md">
										Edit
									</button>
									<button className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md">
										Delete
									</button>
								</div>
							</div>
						))}
					</div>

					<button className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-md mt-2">
						Add Routine
					</button>
				</section> */}
			</main>
		</div>
	)
}

export default App
