import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob'

class AzureStorageService {
	private blobServiceClient: BlobServiceClient
	private connectionStr: string

	private static instance: AzureStorageService | null = null

	constructor() {
		this.connectionStr = process.env
			.AZURE_STORAGE_CONNECTION_STRING as string
		console.log(this.connectionStr)
		this.blobServiceClient = new BlobServiceClient(
			this.connectionStr,
			new AnonymousCredential()
		)

		this.printContainers()
	}

	public static getInstance() {
		if (!AzureStorageService.instance)
			AzureStorageService.instance = new AzureStorageService()
		return AzureStorageService.instance
	}

	private async printContainers() {
		let i = 1
		let iter = this.blobServiceClient.listContainers()
		for await (const container of iter) {
			console.log(`Container ${i++}: ${container.name}`)
		}
	}

	async createContainer(containerName: string): Promise<void> {
		const containerClient =
			this.blobServiceClient.getContainerClient(containerName)
		await containerClient.create()
	}

	async uploadFile(
		containerName: string,
		fileName: string,
		fileContent: Buffer
	): Promise<void> {
		const containerClient =
			this.blobServiceClient.getContainerClient(containerName)
		const blockBlobClient = containerClient.getBlockBlobClient(fileName)
		await blockBlobClient.uploadData(fileContent)
	}

	async deleteContainer(containerName: string): Promise<void> {
		const containerClient =
			this.blobServiceClient.getContainerClient(containerName)
		await containerClient.delete()
	}
}

export default AzureStorageService
