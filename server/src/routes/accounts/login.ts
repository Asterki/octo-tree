import passport from 'passport'
import { z } from 'zod'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import RedisClient from '../../services/redis'

import { NextFunction, Request, Response } from 'express'

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: process.env.NODE_ENV === 'production' ? 5 : 10000, // limit each IP to 5 requests per windowMs
	store: new RedisStore({
		sendCommand: async (...args: string[]) =>
			(await RedisClient.getInstance()).getClient().sendCommand([...args]),
	}),
	skipFailedRequests: true
})

const handler = (req: Request, res: Response, next: NextFunction) => {
	const parsedBody = z
		.object({
			email: z.string().email(),
			password: z.string(),
		})
		.safeParse(req.body)

	if (!parsedBody.success)
		return res.status(400).send({
			status: 'invalid-parameters',
		})

	passport.authenticate('local', (err: any, user: any, info: any) => {
		if (err) return next(err)
		if (!user)
			return res.status(200).send({
				status: info.message,
			})

		req.logIn(user, (err) => {
			if (err) return next(err)
			return res.status(200).send({
				status: 'success',
			})
		})
	})(req, res, next)
}

export { limiter }
export default handler
