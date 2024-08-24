import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'
import { rateLimit } from 'express-rate-limit'

import validator from 'validator'
import { z } from 'zod'

import { NextFunction, Request, Response } from 'express'
const prisma = new PrismaClient()

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour 
	max: 1, // limit each IP to 1 requests per windowMs
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
			productID: z.string().min(16).max(16),
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

		// Register the user to the product
		await prisma.boards.create({
			data: {
				id: parsedBody.data.productID,
				name: 'My Board',
				user_id: userID,
			},
		})

		req.login(user, (err) => {
			res.status(200).send({
				status: 'success',
			})
		})
	} catch (error: unknown) {
		res.status(500).send({
			status: 'internal-error',
		})
	}
}

export { limiter}
export default handler
