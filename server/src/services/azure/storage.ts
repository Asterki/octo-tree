import { BlobServiceClient } from "@azure/storage-blob";

class AzureStorageService {
    private blobServiceClient: BlobServiceClient;

    constructor(connectionString: string) {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    }

    async createContainer(containerName: string): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        await containerClient.create();
    }

    async uploadFile(containerName: string, fileName: string, fileContent: Buffer): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadData(fileContent);
    }

    async downloadFile(containerName: string, fileName: string): Promise<Buffer> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const downloadResponse = await blockBlobClient.download();
        const buffer = await downloadResponse.blobBody?.getBuffer();
        if (!buffer) {
            throw new Error("Failed to download file");
        }
        return buffer;
    }

    async deleteContainer(containerName: string): Promise<void> {
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        await containerClient.delete();
    }
}

export default AzureStorageService;