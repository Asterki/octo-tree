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
			socket.on('getsensordata', (data) => {
				const { userID, boardID } = data
				if (!userID || !boardID) return

				// Get the sensor data
				const prisma = new PrismaClient()
				prisma.boards
					.findFirst({
						where: {
							id: boardID,
							user_id: userID,
						},
					})
					.then((board) => {
						if (!board) return
						// if (!bcrypt.compareSync(data.sensorShareToken, board.sensorShareToken)) return

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
