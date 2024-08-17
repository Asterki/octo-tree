import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js'

class SoilAnalysisService {
	private computerVisionClient: ComputerVisionClient | null = null
	private endpoint: string
	private key: string

	private static instance: SoilAnalysisService | null = null

	private constructor() {
		this.endpoint = process.env.AZURE_SA_ENDPOINT || ''
		this.key = process.env.AZURE_SA_KEY || ''

		const cognitiveServiceCredentials = new CognitiveServicesCredentials(
			this.key
		)
		this.computerVisionClient = new ComputerVisionClient(
			cognitiveServiceCredentials,
			this.endpoint
		)
	}

	public static getInstance() {
		if (!SoilAnalysisService.instance)
			SoilAnalysisService.instance = new SoilAnalysisService()
		return SoilAnalysisService.instance
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

	public async analizeLocalImage(imagePath: string) {
		if (!this.computerVisionClient) {
			throw new Error('Computer Vision client not initialized')
		}

		const imageBuffer = Buffer.from(imagePath, 'base64')

		const result = await this.computerVisionClient.describeImageInStream(
			imageBuffer,
			{
				maxCandidates: 1,
			}
		)

		return result
	}
}

export default SoilAnalysisService
