import { AzureOpenAI } from 'openai'

class OpenAIService {
	private OpenAIClient: AzureOpenAI | null = null
	private endpoint: string
	private key: string
	private apiVersion: string
	private deployment: string

	private static instance: OpenAIService | null = null

	private constructor() {
		this.endpoint = process.env.AZURE_OAI_ENDPOINT || ''
		this.key = process.env.AZURE_OAI_KEY || ''
		this.apiVersion = process.env.AZURE_OAI_API_VERSION || ''
		this.deployment = process.env.AZURE_OAI_DEPLOYMENT || ''

		this.OpenAIClient = new AzureOpenAI({
			endpoint: this.endpoint,
			apiKey: this.key,
			apiVersion: this.apiVersion,
			deployment: this.deployment,
		})
	}

	public static getInstance() {
		if (!OpenAIService.instance)
			OpenAIService.instance = new OpenAIService()
		return OpenAIService.instance
	}

	public async genrateAnswer(
		role: 'function' | 'system' | 'user' | 'assistant' | 'tool',
		content: string
	) {
		if (!this.OpenAIClient) throw new Error('OpenAI client not initialized')

		const response = await this.OpenAIClient.chat.completions.create({
			model: 'davinci',
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that allow people to ask questions about the app octo-tree',
				},
				{
					role: role as any,
					content: content,
				},
			],
			stream: false,
			stop: ['\n'],
			max_tokens: 150,
		})

		console.log(JSON.stringify(response, null, 2))

		return response
	}
}

export default OpenAIService
