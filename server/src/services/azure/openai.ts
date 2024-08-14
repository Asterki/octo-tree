import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'

// This file should not be used, as it is not yet implemented in the project
class OpenAIService {
	private computerVisionClient: ComputerVisionClient | null = null
	private endpoint: string
	private key: string

	private static instance: OpenAIService | null = null

	private constructor() {
		this.endpoint = process.env.AZURE_OAI_ENDPOINT || ''
		this.key = process.env.AZURE_OAI_KEY || ''

		const cognitiveServiceCredentials = new CognitiveServicesCredentials(
			this.key
		)
		this.computerVisionClient = new ComputerVisionClient(
			cognitiveServiceCredentials,
			this.endpoint
		)
	}

	public static getInstance() {
		if (!OpenAIService.instance) OpenAIService.instance = new OpenAIService()
		return OpenAIService.instance
	}

	public async analyzeImage(imageUrl: string) {
		if (!this.computerVisionClient) {
			throw new Error('Computer Vision client not initialized')
		}

		const result = await this.computerVisionClient.describeImage(imageUrl, {
			maxCandidates: 1,
		})

		return result
	}
}

export default OpenAIService
