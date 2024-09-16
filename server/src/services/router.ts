import express, { Express, Router as ExpressRouter } from 'express'

// Account routes
import accountsRegister, { limiter as accountsRegisterLimiter } from '../routes/accounts/register'
import accountsLogin, { limiter as accountsLoginLimiter } from '../routes/accounts/login'
import accountsMe, { limiter as accountsMeLimiter } from '../routes/accounts/me'
import accountsLogout, { limiter as accountsLogoutLimiter } from '../routes/accounts/logout'

// Analysis routes
import soilUpload, { limiter as soilUploadLimiter } from '../routes/analysis/soil'
import panelUpload, { limiter as panelUploadLimiter } from '../routes/analysis/panel'

// Routines routes
import routinesGet, { limiter as routinesGetLimiter } from '../routes/routines/get'


// Hardware routes
import hardwareSensors from '../routes/hardware/sensors'
import hardwareGet from '../routes/hardware/get'

class Router {
	public accountRouter = express.Router()
	public soilRouter = express.Router()
	public hardwareRouter = express.Router()
	public routinesRouter = express.Router()
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

		// Routines routes
		this.routinesRouter.get('/get', routinesGetLimiter, routinesGet)

		// Hardware routes
		this.hardwareRouter.post('/update', hardwareSensors)
		this.hardwareRouter.post('/get', hardwareGet)

		server.use('/api/accounts', this.accountRouter)
		server.use('/api/analysis', this.soilRouter)
		server.use('/api/hardware', this.hardwareRouter)
		server.use('/api/routines', this.routinesRouter)
	}
}

export default Router
