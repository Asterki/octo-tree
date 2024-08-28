import express, { Express, Router as ExpressRouter } from 'express'

// Account routes
import accountsRegister, { limiter as accountsRegisterLimiter } from '../routes/accounts/register'
import accountsLogin, { limiter as accountsLoginLimiter } from '../routes/accounts/login'
import accountsMe, { limiter as accountsMeLimiter } from '../routes/accounts/me'
import accountsLogout, { limiter as accountsLogoutLimiter } from '../routes/accounts/logout'

// Analysis routes
import soilUpload, { limiter as soilUploadLimiter } from '../routes/analysis/soil'
import panelUpload, { limiter as panelUploadLimiter } from '../routes/analysis/panel'

// Hardware routes
import hardwareSensors from '../routes/hardware/sensors'
import hardwareGet from '../routes/hardware/get'

class Router {
	public accountRouter: ExpressRouter = express.Router()
	public soilRouter = express.Router()
	public hardwareRouter = express.Router()
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

		// Analysis routes
		this.soilRouter.post('/panel', panelUploadLimiter, panelUpload)
		this.soilRouter.post('/soil', soilUploadLimiter, soilUpload)

		// Hardware routes
		this.hardwareRouter.post('/update', hardwareSensors)
		this.hardwareRouter.post('/get', hardwareGet)

		server.use('/api/accounts', this.accountRouter)
		server.use('/api/analysis', this.soilRouter)
		server.use('/api/hardware', this.hardwareRouter)
	}
}

export default Router
