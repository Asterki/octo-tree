import { NextFunction, Request, Response } from 'express'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import RedisClient from '../../services/redis'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100, // limit each IP to 100 requests per windowMs
	store: new RedisStore({
		sendCommand: (...args: string[]) =>
			RedisClient.getInstance().getClient().sendCommand(args),
	}),
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	return res.status(200).send({
		status: 'success',
		user: user as any,
	})
}

export { limiter }
export default handler
