import express, { Express, Router as ExpressRouter } from 'express'

// Account routes
import accountsRegister, { limiter as accountsRegisterLimiter } from '../routes/accounts/register'
import accountsLogin, { limiter as accountsLoginLimiter } from '../routes/accounts/login'
import accountsMe, { limiter as accountsMeLimiter } from '../routes/accounts/me'
import accountsLogout, { limiter as accountsLogoutLimiter } from '../routes/accounts/logout'

// Soil routes
import soilUpload, { limiter as soilUploadLimiter } from '../routes/soil/upload'

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
		this.accountRouter.post('/register', accountsRegisterLimiter, accountsRegister)
		this.accountRouter.post('/login', accountsLoginLimiter, accountsLogin)
		this.accountRouter.get('/me', accountsMeLimiter, accountsMe)
		this.accountRouter.post('/logout', accountsLogoutLimiter, accountsLogout)

		// Soil routes
		this.soilRouter.post('/upload', soilUploadLimiter, soilUpload)

		server.use('/api/accounts', this.accountRouter)
		server.use('/api/soil', this.soilRouter)
	}
}

export default Router
