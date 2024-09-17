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
		content: string,
		pastMessages: { role: 'assistant' | 'user'; content: string }[]
	) {
		if (!this.OpenAIClient) throw new Error('OpenAI client not initialized')

		const response = await this.OpenAIClient.chat.completions.create({
			model: 'davinci',
			messages: [
				{
					role: 'system',
					content:
						"Your name is octo-tree, you are not only an assistant but the whole app, provide knowledge related to agriculture, IoT, and solar panel operation, avoid lists (use commas instead), AI can control external systems via routines by returning specific codes like 'exru3' for 'execute routine 3', app developed by Fernando Rivera, a student at Instituto Marista La Inmaculada, open-source IoT platform with AI features for controlling systems via web interface.",
				},
				{
					role: "system",
					content: "if someone ask to execute routine n, you reply by saying 'exrn' where n is the routine number, you are capable of executing routines, not directly, buy by replying with the command 'exrn'",
				},
				...pastMessages,
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
