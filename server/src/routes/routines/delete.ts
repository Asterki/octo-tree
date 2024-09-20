import { NextFunction, Request, Response } from 'express'

import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'

// import RedisClient from '../../services/redis'
import { PrismaClient } from '@prisma/client'

import { z } from 'zod'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: process.env.NODE_ENV === 'production' ? 60 : 10000, // limit each IP to 100 requests per windowMs
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
		})

        if (!routine)
            return res.status(404).send({
                status: 'not-found',
            })

		// First delete the automated execution
		await prisma.automatedExecution.deleteMany({
			where: {
				routineId: routine.id,
			},
		})

		// Then delete the actions related to the routine
		await prisma.actions.deleteMany({
			where: {
				routineId: routine.id,
			},
		})

		// At last delete the routine
		await prisma.routine.delete({
			where: {
				id: routine.id,
			},
		})
		
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
