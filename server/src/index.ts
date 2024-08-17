import express, { Express } from 'express'
import path from 'path'
import { createServer } from 'http'

// Middleware
import cors from 'cors'
import cookie from 'cookie-parser'

// Services
import Router from './services/router'
import SessionController from './services/sessions'
import SocketServer from './services/socket'
import Logger from './services/logger'
import SoilAnalysisService from './services/azure/soil_analysis'

import 'dotenv/config'

class Server {
	private static instance: Server | null = null

	// Server related
	app: Express = express()
	port: number
	dev: boolean

	// Services
	sessions: SessionController = SessionController.prototype.getInstance()
	httpServer: ReturnType<typeof createServer> = createServer(this.app)
	router: Router = Router.prototype.getInstance()
	socketServer: SocketServer = SocketServer.getInstance()

	constructor(dev: boolean, port: number) {
		this.checkEnv()
		this.dev = dev
		this.port = port
		Logger.getInstance().info(
			`Server initialized in ${
				dev ? 'development' : 'production'
			} mode on port ${port}`,
			true
		)
	}

	public static getInstance() {
		if (!this.instance) this.instance = new Server(false, 3000)
		return this.instance
	}

	async startServer() {
		try {
			this.loadMiddlewares()
			this.sessions.loadToServer(this.app)
			this.router.registerRoutes(this.app)

			this.httpServer.listen(this.port, () => {
				Logger.getInstance().info(`Server running on port ${this.port}`)
			})

			this.socketServer.loadToServer(this.httpServer)
			Logger.getInstance().info('Server started', true)

			// Test the Azure service
			const service = SoilAnalysisService.getInstance()
			const result = await service.analizeLocalImage(
				path.join(__dirname, 'uploads/soil/77810b2b-810a-4dd9-b646-162a9c81040c/c3eb5035-a2a1-49a4-8fa2-4e283a46a643')
			)
			console.log(result)
		} catch (error) {
			Logger.getInstance().error(
				`Failed to start server: ${(error as any).message}`,
				true
			)
			throw error
		}
	}

	private checkEnv() {
		const requiredKeys = [
			'SESSION_SECRET',
			'AZURE_SA_ENDPOINT',
			'AZURE_SA_KEY',
			'AZURE_VR_ENDPOINT',
			'AZURE_VR_KEY',
			'AZURE_OAI_ENDPOINT',
			'AZURE_OAI_KEY',
		]
		for (const key of requiredKeys) {
			if (!process.env[key]) {
				const errorMessage = `Missing environment variable: ${key}`
				Logger.getInstance().error(errorMessage, true)
				throw new Error(errorMessage)
			}
		}
	}

	private loadMiddlewares() {
		this.app.use(express.json())
		this.app.use(cookie(process.env.SESSION_SECRET as string))
		Logger.getInstance().info('Middlewares loaded', true)

		if (!this.dev) {
			this.app.use(
				express.static(path.join(__dirname, '../../client/dist'))
			)
			Logger.getInstance().info(
				'Serving static files from client/dist',
				true
			)
		} else {
			this.app.use(
				cors({
					origin: 'http://localhost:5173',
					credentials: true,
					exposedHeaders: ['set-cookie'],
					allowedHeaders: ['Content-Type'],
				})
			)
			Logger.getInstance().info('CORS configured for development', true)
		}
	}
}

const dev = process.env.NODE_ENV !== 'production'
const server = new Server(dev, 3000)
server.startServer()

export default Server
