import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

import { rateLimit } from 'express-rate-limit'
// import { RedisStore } from 'rate-limit-redis'
// import RedisClient from '../../services/redis'

import validator from 'validator'
import { z } from 'zod'

import { NextFunction, Request, Response } from 'express'
const prisma = new PrismaClient()

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: process.env.NODE_ENV === 'production' ? 10 : 100, // limit each IP to 100 requests per windowMs
	// store: new RedisStore({
	// 	sendCommand: async (...args: string[]) =>
	// 		(await RedisClient.getInstance())
	// 			.getClient()
	// 			.sendCommand([...args]),
	// }),
	skipFailedRequests: true,
})

const handler = async (req: Request, res: Response, next: NextFunction) => {
	const parsedBody = z
		.object({
			email: z.string().email(),
			password: z
				.string()
				.min(8)
				.refine((pass) => {
					return validator.isStrongPassword(pass)
				}),
			productID: z.string(),
		})
		.safeParse(req.body)

	if (!parsedBody.success)
		return res.status(400).send({
			status: 'invalid-parameters',
		})

	try {
		// Check if the user exists
		const userExists = await prisma.user.findFirst({
			where: {
				email: parsedBody.data.email,
			},
		})
		if (userExists)
			return res.status(400).send({
				status: 'user-exists',
			})

		// Create the user object
		let userID = uuidv4()
		const hashedPassword = await bcrypt.hash(parsedBody.data.password, 10)

		// Create the user
		const user = await prisma.user.create({
			data: {
				id: userID,
				email: parsedBody.data.email,
				password: hashedPassword,
			},
		})

		// Check if the product exists
		const productExists = await prisma.boards.findFirst({
			where: {
				id: parsedBody.data.productID,
			},
		})
		if (!productExists)
			return res.status(400).send({
				status: 'product-not-found',
			})

		// Register the user to the product
		await prisma.boards.update({
			where: {
				id: parsedBody.data.productID,
			},
			data: {
				user: {
					connect: {
						id: userID,
					},
				},
			},
		})

		req.login(user, (err) => {
			res.status(200).send({
				status: 'success',
			})
		})
	} catch (error: unknown) {
		console.log(error)
		res.status(500).send({
			status: 'internal-error',
		})
	}
}

export { limiter }
export default handler
