import axios from 'axios'

class SoilAnalysisService {
	private pa_endpoint: string
	private pa_key: string
	private sa_endpoint: string
	private sa_key: string

	private static instance: SoilAnalysisService | null = null

	private constructor() {
		this.pa_endpoint = process.env.AZURE_PA_ENDPOINT || ''
		this.pa_key = process.env.AZURE_PA_KEY || ''
		this.sa_endpoint = process.env.AZURE_SA_ENDPOINT || ''
		this.sa_key = process.env.AZURE_SA_KEY || ''
	}

	public static getInstance() {
		if (!SoilAnalysisService.instance)
			SoilAnalysisService.instance = new SoilAnalysisService()
		return SoilAnalysisService.instance
	}

	public async analyzeImage(type: 'soil' | 'panel', imageUrl: string) {
		let endpoint = type === 'soil' ? this.sa_endpoint : this.pa_endpoint
		let key = type === 'soil' ? this.sa_key : this.pa_key

		// Use a custom model named "v1"
		const url = `${endpoint}/computervision/imageanalysis:analyze`
		const response = await axios({
			method: 'post',
			url: url,
			headers: {
				'Ocp-Apim-Subscription-Key': key,
				'Content-Type': 'application/json',
			},
			params: {
				'api-version': '2023-02-01-preview',
				'model-name': 'v1',
			},
			data: {
				url: imageUrl,
			},
		})

		return response.data.customModelResult.tagsResult.values
	}
}

export default SoilAnalysisService
