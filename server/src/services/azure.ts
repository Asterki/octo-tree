import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'

class AzureService {
	private computerVisionClient: ComputerVisionClient | null = null
	private endpoint: string
	private key: string

	private static instance: AzureService | null = null

	private constructor() {
		this.endpoint = process.env.AZURE_ENDPOINT || ''
		this.key = process.env.AZURE_KEY || ''

		const cognitiveServiceCredentials = new CognitiveServicesCredentials(
			this.key
		)
		this.computerVisionClient = new ComputerVisionClient(
			cognitiveServiceCredentials,
			this.endpoint
		)
	}

	public static getInstance() {
		if (!AzureService.instance) AzureService.instance = new AzureService()
		return AzureService.instance
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

export default AzureService
