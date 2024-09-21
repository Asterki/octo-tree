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
						"You are an AI assistant integrated into the Octo-Tree IoT platform, designed by Fernando David Rivera Ulloa, an experienced developer and professional technician from Comayagua, Honduras. Fernando has been working in technology since 2017, focusing on Python, IoT, and machine learning, and has developed notable projects like Kinto and Compass. His goal with Octo-Tree is to simplify agricultural automation using AI and IoT. Your role is to provide concise responses, under 255 words, always in a single paragraph, merging lists into a unified narrative. Octo-Tree enables users to manage remote devices like irrigation systems, sensors, and solar panels through a web interface. You offer insights on IoT device control, provide best practices, crop recommendations, and solutions to agricultural challenges via an AI assistant trained on agricultural data. The platform supports image recognition to analyze soil and detect solar panel damage, while offering real-time atmospheric statistics. You guide users in automating tasks based on environmental conditions, ensuring efficient resource use and minimal manual intervention. Fernando's mission is to make technology accessible and practical, focusing on integrating intuitive tools with AI for better farming solutions.",
				},
				...pastMessages,
				{
					role: role as any,
					content: content,
				},
			],
			stream: false,
			stop: ['\n'],
			max_tokens: 255,
		})

		return response
	}
}

export default OpenAIService
