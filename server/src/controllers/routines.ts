import { PrismaClient } from '@prisma/client'

class RoutineController {
	private static instance: RoutineController | null = null
	private prisma = new PrismaClient()
	private intervalId: NodeJS.Timeout | undefined

	public static getInstance() {
		if (!RoutineController.instance) {
			RoutineController.instance = new RoutineController()
		}
		return RoutineController.instance
	}

	public async loadToServer() {
		this.intervalId = setInterval(async () => {
			try {
				const routines = await this.prisma.routine.findMany({
					where: {
						automatedExecution: {
							// This is datetime object,
							nextExecutionInterval: {
								lte: new Date(Date.now()),
							},
						},
					},
					include: {
						actions: {
							select: {
								notify: true,
								water: true,
								rotatePanel: true,
							},
						},
						automatedExecution: {
							select: {
								conditions: {
									select: {
										humidityBelow: true,
										humidityExceeds: true,
										temperatureBelow: true,
										temperatureExceeds: true,
									},
								},
								nextExecutionInterval: true,
								checkInterval: true,
							},
						},
					},
				})

				if (!routines) return

				for (const routine of routines) {
					const board = await this.prisma.board.findFirst({
						where: { id: routine.boardId! },
					})
					if (!board) return
					const sensorData = JSON.parse(board.sensorData)

					if (routine.execution === 'automated') {
						// Check conditions
						if (
							this.checkCondition(
								routine!.automatedExecution!.conditions!
									.humidityBelow,
								sensorData.humidity
							) ||
							this.checkCondition(
								routine!.automatedExecution!.conditions!
									.humidityExceeds,
								sensorData.humidity
							) ||
							this.checkCondition(
								routine!.automatedExecution!.conditions!
									.temperatureBelow,
								sensorData.temperature
							) ||
							this.checkCondition(
								routine!.automatedExecution!.conditions!
									.temperatureExceeds,
								sensorData.temperature
							)
						) {
							await this.executeRoutine(routine)
						}

						// Update the routine
						await this.prisma.routine.update({
							where: { id: routine.id },
							data: {
								automatedExecution: {
									update: {
										nextExecutionInterval: new Date(
											Date.now() +
												routine.automatedExecution!
													.checkInterval
										),
									},
								},
							},
						})
					}
				}
			} catch (error) {
				console.error('Error in loadToServer:', error)
			}
		}, 5000)
	}

	private async executeRoutine(routine: any) {
		if (routine.actions.notify) {
			// Send a notification
		}

		if (routine.actions.water) {
			// First check if there are any pending water action
			this.createIfNotExists(
				'water',
				routine.boardId,
				routine.actions.water.amount
			)
		}

		if (routine.actions.rotatePanel) {
			// First check if there are any pending rotatePanel action
			this.createIfNotExists(
				'rotatePanel',
				routine.boardId,
				routine.actions.rotatePanel.amount
			)
		}
	}

	private async createIfNotExists(
		actionType: string,
		boardId: string,
		actionValue: number
	) {
		const pendingAction = await this.prisma.triggeredActions.findFirst({
			where: { actionType, boardId },
		})

		if (!pendingAction) {
			await this.prisma.triggeredActions.create({
				data: { actionType, boardId, actionValue },
			})
		}
	}

	private checkCondition(condition: any, sensorValue: number): boolean {
		return condition.active && condition.value >= sensorValue
	}

	public async cleanup() {
		clearInterval(this.intervalId)
		await this.prisma.$disconnect()
	}
}

export default RoutineController
