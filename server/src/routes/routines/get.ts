import { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'

// import RedisClient from '../../services/redis'
import { PrismaClient } from '@prisma/client'

import { z } from 'zod'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: process.env.NODE_ENV === 'production' ? 3 : 10000, // limit each IP to 100 requests per windowMs
	// store: new RedisStore({
	// 	sendCommand: async (...args: string[]) =>
	// 		(await RedisClient.getInstance())
	// 			.getClient()
	// 			.sendCommand([...args]),
	// }),
	skipFailedRequests: true,
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user
	if (!user)
		return res.status(401).send({
			status: 'unauthenticated',
		})

	try {
		const prisma = new PrismaClient()

		res.status(200).send({
			status: 'success',
		})
	} catch (error) {
		return res.status(500).send({
			status: 'internal-server-error',
		})
	}
}

export { limiter }
export default handler
