import { NextFunction, Request, Response } from 'express'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import RedisClient from '../../services/redis'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: process.env.NODE_ENV === 'production' ? 5 : 10000, // limit each IP to 5 requests per windowMs
	store: new RedisStore({
		sendCommand: async (...args: string[]) =>
			(await RedisClient.getInstance()).getClient().sendCommand([...args]),
	}),
	skipFailedRequests: true
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	req.logOut({ keepSessionInfo: false }, (err) => {
		if (err) return next(err)
		return res.send({
			status: 'success',
		})
	})
}

export { limiter }
export default handler
