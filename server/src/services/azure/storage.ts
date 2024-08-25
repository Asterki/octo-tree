import {
	BlobServiceClient,
	AnonymousCredential,
	BlobSASPermissions,
} from '@azure/storage-blob'

class AzureStorageService {
	private blobServiceClient: BlobServiceClient
	private connectionString: string

	private static instance: AzureStorageService | null = null

	constructor() {
		this.connectionString =
			process.env.AZURE_STORAGE_CONNECTION_STRING || ''

		this.blobServiceClient = BlobServiceClient.fromConnectionString(
			this.connectionString
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
	): Promise<string> {
		const containerClient =
			this.blobServiceClient.getContainerClient(containerName)
		const blockBlobClient = containerClient.getBlockBlobClient(fileName)
		await blockBlobClient.uploadData(fileContent)

		// Get the URL of the uploaded file
		return blockBlobClient.generateSasUrl({
			startsOn: new Date(),
			expiresOn: new Date(new Date().valueOf() + 86400),
			permissions: BlobSASPermissions.parse('r'),
		})
	}

	async deleteContainer(containerName: string): Promise<void> {
		const containerClient =
			this.blobServiceClient.getContainerClient(containerName)
		await containerClient.delete()
	}
}

export default AzureStorageService
