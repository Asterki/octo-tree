import { PrismaClient } from '@prisma/client'

class SensorService {
	private instance: SensorService | null = null

	getInstance() {
		if (!this.instance) {
			this.instance = new SensorService()
		}
		return this.instance
	}

	async getSensorData(boardID: string) {
		const prisma = new PrismaClient()
		const sensors = await prisma.sensorData.findMany()
		prisma.$disconnect()
		return sensors
	}

	async setSensorData(boardID: string, sensorData: any) {
		const prisma = new PrismaClient()
		const sensor = await prisma.sensorData.create({
			data: {
                board_id: boardID,
                values: JSON.stringify(sensorData),
			},
		})
		prisma.$disconnect()
		return sensor
	}
}

export default SensorService
