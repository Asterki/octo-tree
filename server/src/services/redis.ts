import { createClient, RedisClientType } from 'redis'

class RedisClient {
	private static instance: RedisClient
	private client: RedisClientType

	constructor() {
		Promise.resolve(
			(this.client = createClient({
				url: process.env.REDIS_URL,
			}))
		)
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
