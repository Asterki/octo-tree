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

	const parsedBody = z
		.object({
			routine_id: z.number(),
		})
		.safeParse(req.body)

	if (!parsedBody.success)
		return res.status(400).send({
			status: 'invalid-parameters',
			errors: parsedBody.error,
		})

	try {
		const prisma = new PrismaClient()

		const board = await prisma.board.findFirst({
			where: {
				user_id: (user as any).id,
			},
		})

		const routine = await prisma.routine.findFirst({
			where: {
				id: parsedBody.data.routine_id,
				boardId: board?.id,
			},
			include: {
				actions: {
					select: {
						notify: true,
						water: true,
						rotatePanel: true,
					},
				},
			},
		})

		if (!routine || !board)
			return res.status(404).send({
				status: 'not-found',
			})

		// Add the routine to the pending actions queue
		if (routine.actions?.notify.active) {
			// TODO Notify via email
		}
		if (routine.actions?.water.active) {
			await prisma.triggeredActions.create({
				data: {
					actionType: 'water',
					actionValue: routine.actions.water.amount,
					boardId: board?.id,
					executeAt: new Date(Date.now()),
				},
			})
		}
		if (routine.actions?.rotatePanel.active) {
			await prisma.triggeredActions.create({
				data: {
					actionType: 'rotatePanel',
					actionValue: 0.0,
					boardId: board?.id,
					executeAt: new Date(Date.now()),
				},
			})
		}


		await prisma.$disconnect()

		return res.status(200).send({
			status: 'success',
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({
			status: 'internal-server-error',
		})
	}
}

export { limiter }
export default handler
