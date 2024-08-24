import { createClient, RedisClientType } from 'redis'
import Logger from './logger'

class RedisClient {
	private static instance: RedisClient
	private client: RedisClientType

	constructor() {
		Promise.resolve(
			(this.client = createClient({
				url: process.env.REDIS_URL,
			}))
		)

		this.client.on('error', (error) => {
			Logger.getInstance().error(
				`Redis error: ${(error as any).message}`,
				true
			)
		})
		Logger.getInstance().info('Redis connected', true)
	}

	public static getInstance() {
		if (!RedisClient.instance) RedisClient.instance = new RedisClient()
		return RedisClient.instance
	}

	public getClient() {
		return this.client
	}
}

export default RedisClient
