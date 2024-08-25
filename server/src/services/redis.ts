import { createClient, RedisClientType } from 'redis'
import Logger from './logger'

class RedisClient {
	private static instance: RedisClient
	private client: RedisClientType

	private constructor() {
		// The constructor is now private to prevent direct instantiation
		this.client = createClient({
			url: process.env.REDIS_URL,
		})

		this.client.on('error', (error) => {
			Logger.getInstance().error(
				`Redis error: ${(error as any).message}`,
				true
			)
		})
	}

	// Public method to get the singleton instance
	public static async getInstance(): Promise<RedisClient> {
		if (!RedisClient.instance) {
			RedisClient.instance = new RedisClient()
			await RedisClient.instance.connect() // Ensure the client is connected
		}
		return RedisClient.instance
	}

	// Private method to connect the client
	private async connect(): Promise<void> {
		if (!this.client.isOpen) {
			await this.client.connect()
			Logger.getInstance().info('Redis connected', true)
		}
	}

	// Method to get the Redis client
	public getClient(): RedisClientType {
		return this.client
	}
}

export default RedisClient
