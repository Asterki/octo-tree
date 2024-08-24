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
		const sensors = await prisma.sensor.findMany()
		prisma.$disconnect()
		return sensors
	}

	async setSensorData(boardID: string, sensorData: any) {
		const prisma = new PrismaClient()
		const sensor = await prisma.sensor.create({
			data: {
				boardID: boardID,
				data: sensorData,
			},
		})
		prisma.$disconnect()
		return sensor
	}
}
