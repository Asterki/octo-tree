import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'

class AzureService {
	private computerVisionClient: ComputerVisionClient | null = null
	private endpoint: string
	private key: string

	constructor(endpoint: string, key: string) {
		this.endpoint = endpoint
		this.key = key

		const cognitiveServiceCredentials = new CognitiveServicesCredentials(
			this.key,
		)
		this.computerVisionClient = new ComputerVisionClient(
			cognitiveServiceCredentials,
			this.endpoint,
		)
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
