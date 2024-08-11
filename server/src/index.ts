import express, { Express } from 'express'
import path from 'path'

// Middleware
import cors from 'cors'
import cookie from 'cookie-parser'

// Services
import Router from './services/router'
import SessionController from './services/sessions'

import 'dotenv/config'

class Server {
	private static instance: Server | null = null

	// Server related
	app: Express = express()
	port: number
	dev: boolean

	// Services
	sessions: SessionController = SessionController.prototype.getInstance()
	router: Router = Router.prototype.getInstance()

	constructor(dev: boolean, port: number) {
		this.checkEnv()
		this.dev = dev
		this.port = port
	}

	public static getInstance() {
		if (!this.instance) this.instance = new Server(false, 3000)
		return this.instance
	}

	async startServer() {
		this.loadMiddlewares()
		this.sessions.loadToServer(this.app)
		this.router.registerRoutes(this.app)
	}

	private checkEnv() {
		const requiredKeys = ['MONGODB_URI', 'SESSION_SECRET']
		for (const key of requiredKeys) {
			if (!process.env[key]) {
				throw new Error(`Missing environment variable: ${key}`)
			}
		}
	}

	private loadMiddlewares() {
		this.app.use(express.json())
		this.app.use(cookie(process.env.SESSION_SECRET as string))

		if (!this.dev) {
			this.app.use(
				express.static(path.join(__dirname, '../../client/dist'))
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
		}
	}
}

const dev = process.env.NODE_ENV !== 'production'
const server = new Server(dev, 3000)
server.startServer()

export default Server
