import express, { Express, Router as ExpressRouter } from 'express'

// Account routes
import accountsRegister from '../routes/accounts/register'
import accountsLogin from '../routes/accounts/login'
import accountsMe from '../routes/accounts/me'
import accountsLogout from '../routes/accounts/logout'

// Soil routes
import soilUpload from '../routes/soil/upload'

class Router {
	public accountRouter: ExpressRouter = express.Router()
	public soilRouter = express.Router()
	private instance: Router | null = null

	constructor() {}

	getInstance() {
		if (!this.instance) this.instance = new Router()
		return this.instance
	}

	public registerRoutes = (server: Express) => {
		// Account routes
		this.accountRouter.post('/register', accountsRegister)
		this.accountRouter.post('/login', accountsLogin)
		this.accountRouter.get('/me', accountsMe)
		this.accountRouter.post('/logout', accountsLogout)

		// Soil routes
		this.soilRouter.post('/upload', soilUpload)

		server.use('/api/accounts', this.accountRouter)
		server.use('/api/soil', this.soilRouter)
	}
}

export default Router
