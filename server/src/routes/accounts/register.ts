import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

import validator from 'validator'
import { z } from 'zod'

import { NextFunction, Request, Response } from 'express'
const prisma = new PrismaClient()

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

		const user = await prisma.user.create({
			data: {
				id: userID,
				email: parsedBody.data.email,
				password: hashedPassword,
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

export default handler
