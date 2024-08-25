import * as React from 'react'
import { Socket, io } from 'socket.io-client'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

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
	faPerson,
	faQuestion,
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
		intersect: false,
	},
	scales: {
		x: {
			stacked: true,
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
						userID: 'c128e86e-356d-42ef-b735-8ab3edc2b7f0',
						boardID: 'cm08xii1z00008sqfb8j8ih1x',
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

	const logout = async () => {
		const response = await axios({
			url: `${import.meta.env.VITE_API_URL}/api/accounts/logout`,
			method: 'post',
			withCredentials: true,
		})

		if (response.status === 200) {
			dispatch(setUser(null))
			navigate('/login')
		}
	}

	return (
		<div className="bg-neutral-100 min-h-screen text-neutral-600">
			{/* Navbar */}
			<div className="bg-emerald-700 shadow-md text-white w-full flex items-center justify-between px-4">
				<h1 className="text-3xl font-bold p-4">Octo Tree</h1>
				<p
					className="cursor-pointer bg-red-400 rounded-md p-2 font-bold"
					onClick={logout}
				>
					Logout
				</p>
			</div>

			<main className="grid grid-cols-12 grid-rows-4 gap-4 p-4">
				<section className="flex flex-col items-center justify-start gap-2 col-span-2 row-span-1 rounded-md shadow-lg bg-white p-4">
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

					<button className="rounded-md shadow-md bg-red-400 p-2 text-white">
						Disconnect
					</button>
				</section>
				<form>
					<input type="file" name="" id="" />
					<button
						onClick={(e) => {
							e.preventDefault()
							console.log('clicked')
							const file = (
								document.querySelector(
									'input[type="file"]'
								) as HTMLInputElement
							).files?.[0]
							const formData = new FormData()
							formData.append('soilimage', file as Blob)
							formData.append(
								'userID',
								'c128e86e-356d-42ef-b735-8ab3edc2b7f0'
							)
							axios
								.post(
									`${
										import.meta.env.VITE_API_URL
									}/api/analysis/soil`,
									formData,
									{
										headers: {
											'Content-Type':
												'multipart/form-data',
										},
										withCredentials: true,
									}
								)
								.then((response) => {
									console.log(response)
								})
						}}
					>
						Upload Image
					</button>
				</form>

				<section className="col-start-1 row-start-3 col-span-4 row-span-2 bg-white rounded-md shadow-lg p-2">
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

				<section className="col-start-5 row-start-3 col-span-4 row-span-2 bg-white rounded-md shadow-lg p-2">
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

				<section className="col-start-3 row-start-2 col-span-2 row-span-1 bg-white rounded-md shadow-lg p-2">
					<div className="flex flex-col gap-2 h-full">
						<button className="bg-slate-200 rounded-md h-full">
							<FontAwesomeIcon
								icon={faPerson}
								className="text-3xl"
							/>
						</button>
						<button className="bg-slate-200 rounded-md h-full">
							<FontAwesomeIcon
								icon={faQuestion}
								className="text-3xl"
							/>
						</button>
					</div>
				</section>
			</main>
		</div>
	)
}

export default App
