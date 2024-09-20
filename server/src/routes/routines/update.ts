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
			routine: z.object({
				name: z.string(),
				execution: z.string(),
				active: z.boolean(),
				automatedExecution: z.object({
					checkInterval: z.number().max(7200).min(5),
					conditions: z.object({
						temperatureExceeds: z.object({
							active: z.boolean(),
							value: z.number(),
						}),
						temperatureBelow: z.object({
							active: z.boolean(),
							value: z.number(),
						}),
						humidityExceeds: z.object({
							active: z.boolean(),
							value: z.number(),
						}),
						humidityBelow: z.object({
							active: z.boolean(),
							value: z.number(),
						}),
					}),
				}),
				actions: z.object({
					water: z.object({
						active: z.boolean(),
						amount: z.number(),
					}),
					rotatePanel: z.object({
						active: z.boolean(),
					}),
					notify: z.object({
						active: z.boolean(),
					}),
				}),
			}),
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

		if (!board) {
			await prisma.$disconnect()
			return res.status(404).send({
				status: 'not-found',
			})
		}

		// Update the routine
		const routine = await prisma.routine.findFirst({
			where: {
				id: parsedBody.data.routine_id,
				boardId: board?.id,
			},
		})

		if (!routine) {
			await prisma.$disconnect()
			return res.status(404).send({
				status: 'not-found',
			})
		}

		await prisma.routine.update({
			where: {
				id: routine.id,
			},
			data: {
				name: parsedBody.data.routine.name,
				execution: parsedBody.data.routine.execution,
				active: parsedBody.data.routine.active,
				automatedExecution: {
					update: {
						checkInterval:
							parsedBody.data.routine.automatedExecution
								.checkInterval,
						conditions: {
							update: {
								temperatureExceeds: {
									update: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureExceeds.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureExceeds.value,
									},
								},
								temperatureBelow: {
									update: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureBelow.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureBelow.value,
									},
								},
								humidityExceeds: {
									update: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityExceeds.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityExceeds.value,
									},
								},
								humidityBelow: {
									update: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityBelow.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityBelow.value,
									},
								},
							},
						},
					},
				},
				actions: {
					update: {
						water: {
							update: {
								active: parsedBody.data.routine.actions.water
									.active,
								amount: parsedBody.data.routine.actions.water
									.amount,
							},
						},
						rotatePanel: {
							update: {
								active: parsedBody.data.routine.actions
									.rotatePanel.active,
							},
						},
						notify: {
							update: {
								active: parsedBody.data.routine.actions.notify
									.active,
							},
						},
					},
				},
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
