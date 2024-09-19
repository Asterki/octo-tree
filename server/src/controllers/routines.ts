import { PrismaClient } from '@prisma/client'

// Basically what this does is that it watched the database every 5 seconds, watching for changes
// in the routines table. If a routine with a "nextExecutionInterval" with a time less than the current
// time, it will add the routine to the triggeredActions table, which will be executed by the board
// Once that's updated, the routine will be updated with a new "nextExecutionInterval" based on the
// "checkInterval" field
class RoutineController {
	private static instance: RoutineController | null = null

	public static getInstance() {
		if (!RoutineController.instance)
			RoutineController.instance = new RoutineController()
		return RoutineController.instance
	}

	public async loadToServer() {
		const prisma = new PrismaClient()

		setInterval(async () => {
			const routines = await prisma.routine.findMany({
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
				let board = await prisma.board.findFirst({
					where: {
						id: routine.boardId!,
					},
				})
				if (!board) return
				let sensorData = JSON.parse(board.sensorData)

				const executeRoutine = async (routine: any) => {
					if (routine.actions.notify) {
						// Send a notification
					}

					if (routine.actions.water) {
						// First check if there are any pending water action
						let pendingWaterAction =
							await prisma.triggeredActions.findFirst({
								where: {
									actionType: 'water',
									boardId: routine.boardId,
								},
							})

						if (!pendingWaterAction) {
							await prisma.triggeredActions.create({
								data: {
									actionType: 'water',
									boardId: routine.boardId,
									actionValue: routine.actions.water.amount,
								},
							})
						}
					}

					if (routine.actions.rotatePanel) {
						// First check if there are any pending rotatePanel action
						let pendingRotatePanelAction =
							await prisma.triggeredActions.findFirst({
								where: {
									actionType: 'rotatePanel',
									boardId: routine.boardId,
								},
							})

						if (!pendingRotatePanelAction) {
							await prisma.triggeredActions.create({
								data: {
									actionType: 'rotatePanel',
									boardId: routine.boardId,
									actionValue: 0.0,
								},
							})
						}
					}
				}

				if (routine.execution == 'automated') {
					// Check if the routine is automated
					// Check the conditions for the routine

					if (
						routine.automatedExecution?.conditions?.humidityBelow
							.active &&
						routine.automatedExecution.conditions.humidityBelow
							.value >= sensorData.humidity
					) {
						executeRoutine(routine)
					}

					if (
						routine.automatedExecution?.conditions?.humidityExceeds
							.active &&
						routine.automatedExecution.conditions.humidityExceeds
							.value <= sensorData.humidity
					) {
						executeRoutine(routine)
					}

					if (
						routine.automatedExecution?.conditions?.temperatureBelow
							.active &&
						routine.automatedExecution.conditions.temperatureBelow
							.value >= sensorData.temperature
					) {
						executeRoutine(routine)
					}

					if (
						routine.automatedExecution?.conditions
							?.temperatureExceeds.active &&
						routine.automatedExecution.conditions.temperatureExceeds
							.value <= sensorData.temperature
					) {
						executeRoutine(routine)
					}

					// Update the routine
					await prisma.routine.update({
						where: {
							id: routine.id,
						},
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
		}, 5000)
	}
}

export default RoutineController
