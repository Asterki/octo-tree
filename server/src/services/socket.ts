import { Server } from 'socket.io'
import { createServer } from 'http'

import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class SocketServer {
	private static instance: SocketServer | null = null
	io: Server = new Server()

	public static getInstance() {
		if (!SocketServer.instance) SocketServer.instance = new SocketServer()
		return SocketServer.instance
	}

	public getClient() {
		return this.io
	}

	loadToServer(server: ReturnType<typeof createServer>) {
		this.io.attach(server, {
			cors: {
				origin: process.env.CLIENT_URL,
				credentials: true,
				exposedHeaders: ['set-cookie'],
			},
		})

		this.io.on('connection', (socket) => {
			socket.on(
				'sensor_update',
				async (data: {
					time_online: number
					temperature: number
					humidity: number
					pressure: number
					light1: number
					light2: number
					board_id: string
					board_key: string
				}) => {
					// Verify the board ID and key
					if (!data.board_id || !data.board_key) return

					const board = prisma.board.findFirst({
						where: {
							id: data.board_id,
						},
					})

					if (!board) return

					// Compare the key using bcrypt
					// if (!bcrypt.compareSync(data.key, board.sensorShareToken)) return // Commented out for now

					// Update the sensor data
					await prisma.board.update({
						where: {
							id: data.board_id,
						},
						data: {
							sensorData: JSON.stringify({
								temperature: data.temperature,
								humidity: data.humidity,
								pressure: data.pressure,
								light1: data.light1,
								light2: data.light2,
							}),
						},
					})
				}
			)

			socket.on('get_sensor_data', (data) => {
				const { userID, boardID } = data
				if (!userID || !boardID) return

				// Get the sensor data
				prisma.board
					.findFirst({
						where: {
							id: boardID,
							user_id: userID,
						},
					})
					.then((board) => {
						if (!board) return

						socket.emit('sensordata', {
							boardID,
							data: board.sensorData,
						})
					})
			})
		})

		// Once the server is ready
		this.io.on('listening', () => {
			console.log('Socket server ready')
		})
	}
}

export default SocketServer
