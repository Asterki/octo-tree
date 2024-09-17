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
			routine: z.object({
				name: z.string(),
				execution: z.string(),
				automatedExecution: z.object({
					checkInterval: z.number(),
					nextExecutionInterval: z.number(),
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

		// Create a new routine
		await prisma.routine.create({
			data: {
				boardId: board.id,
				execution: parsedBody.data.routine.execution,
				name: parsedBody.data.routine.name,
				automatedExecution: {
					create: {
						checkInterval:
							parsedBody.data.routine.automatedExecution
								.checkInterval,
						nextExecutionInterval:
							parsedBody.data.routine.automatedExecution
								.nextExecutionInterval,
						conditions: {
							create: {
								temperatureExceeds: {
									create: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureExceeds.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureExceeds.value,
									},
								},
								temperatureBelow: {
									create: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureBelow.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.temperatureBelow.value,
									},
								},
								humidityExceeds: {
									create: {
										active: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityExceeds.active,
										value: parsedBody.data.routine
											.automatedExecution.conditions
											.humidityExceeds.value,
									},
								},
								humidityBelow: {
									create: {
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
					create: {
						water: {
							create: {
								active: parsedBody.data.routine.actions.water
									.active,
								amount: parsedBody.data.routine.actions.water
									.amount,
							},
						},
						rotatePanel: {
							create: {
								active: parsedBody.data.routine.actions
									.rotatePanel.active,
							},
						},
						notify: {
							create: {
								active: parsedBody.data.routine.actions.notify
									.active,
							},
						},
					},
				},
			},
		})

		await prisma.$disconnect()

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
