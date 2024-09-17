import { Server } from 'socket.io'
import { createServer } from 'http'

import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

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
			console.log('Socket connected')
			let a = 0

			socket.on('event_name', (data) => {
				console.log(data)
				socket.emit('led', {
					state: a,
				})
				a = a === 1 ? 0 : 1
			})

			socket.on('getsensordata', (data) => {
				const { userID, boardID } = data
				if (!userID || !boardID) return

				// Return random data if on dev mode
				socket.emit('sensordata', {
					boardID,
					data: JSON.stringify({
						temperature: Math.floor(Math.random() * 100),
						humidity: Math.floor(Math.random() * 100),
					}),
				})

				return

				// Get the sensor data
				// const prisma = new PrismaClient()
				// prisma.boards
				// 	.findFirst({
				// 		where: {
				// 			id: boardID,
				// 			user_id: userID,
				// 		},
				// 	})
				// 	.then((board) => {
				// 		if (!board) return
				// 		// if (!bcrypt.compareSync(data.sensorShareToken, board.sensorShareToken)) return

				// 		socket.emit('sensordata', {
				// 			boardID,
				// 			data: board.sensorData,
				// 		})
				// 	})
			})
		})

		// Once the server is ready
		this.io.on('listening', () => {
			console.log('Socket server ready')
		})
	}
}

export default SocketServer
