import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'

import RedisClient from '../../services/redis'
import { PrismaClient } from '@prisma/client'

import { z } from 'zod'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: process.env.NODE_ENV === 'production' ? 3 : 10000, // limit each IP to 100 requests per windowMs
	store: new RedisStore({
		sendCommand: async (...args: string[]) =>
			(await RedisClient.getInstance())
				.getClient()
				.sendCommand([...args]),
	}),
	skipFailedRequests: true,
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	console.log('Received request from hardware to update their settings')
	console.log(req.body)

	const parsedBody = z
		.object({
			boardID: z.string(),
			sensorShareToken: z.string(),
			data: z.string(), // JSON string
		})
		.safeParse(req.body)

	if (!parsedBody.success)
		return res.status(400).send({
			status: 'invalid-parameters',
		})

	try {
		const prisma = new PrismaClient()

		// Get the board given the board ID
		const board = await prisma.boards.findFirst({
			where: {
				id: parsedBody.data.boardID,
			},
		})

		if (!board)
			return res.status(404).send({
				status: 'not-found',
			})

		// Check the token using bcrypt
		// const tokenMatch = await bcrypt.compare(
		// 	parsedBody.data.sensorShareToken,
		// 	board.sensorShareToken
		// )
		// if (!tokenMatch)
		// 	return res.status(401).send({
		// 		status: 'unauthenticated',
		// 	})

		// Update the sensor data
		await prisma.boards.update({
			where: {
				id: parsedBody.data.boardID,
			},
			data: {
				sensorData: parsedBody.data.data,
			},
		})

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
