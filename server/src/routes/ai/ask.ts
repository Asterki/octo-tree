import { z } from 'zod'
import { rateLimit } from 'express-rate-limit'
// import { RedisStore } from 'rate-limit-redis'
// import RedisClient from '../../services/redis'

import OpenAIService from '../../services/azure/openai'
import { v4 as uuidv4 } from 'uuid'

import { NextFunction, Request, Response } from 'express'

const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 100, // limit each IP to 5 requests per windowMs
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
			question: z.string().min(8).max(256),
			pastMessages: z
				.array(
					z.object({
						author: z.string(),
						message: z.string(),
					})
				)
				.optional(),
		})
		.safeParse(req.body)

	if (!parsedBody.success)
		return res.status(400).send({
			status: 'invalid-parameters',
		})

	try {
		let newPastMessages: { role: 'assistant' | 'user'; content: string }[] = []
		if (parsedBody.data.pastMessages) {
			newPastMessages = parsedBody.data.pastMessages.map((msg: any) => {
				return {
					role: msg.author == 'Octo-Tree' ? 'assistant' : 'user',
					content: msg.message,
				}
			})
		}

        // grab only the last 10 messages for context
        newPastMessages = newPastMessages.slice(-10)

		const data = await OpenAIService.getInstance().genrateAnswer(
			'user',
			parsedBody.data.question,
			newPastMessages
		)

		return res.status(200).json({
			status: 'success',
			result: data,
		})
	} catch (err) {
		console.log(err)
		return res.status(500).send({
			status: 'error',
		})
	}
}

export { limiter }
export default handler
