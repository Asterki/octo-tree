import SocketServer from '../services/socket'
import EmailService from '../services/email'
import { PrismaClient } from '@prisma/client'

class RoutineController {
	private static instance: RoutineController | null = null
	private prisma = new PrismaClient()
	private intervalId: NodeJS.Timeout | undefined
	private socket = SocketServer.getInstance()

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
						active: true,
						execution: 'automated',
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
						include: {
							user: true,
						},
					})
					if (!board) return
					const sensorData = JSON.parse(board.sensorData)

					if (routine.execution === 'automated') {
						// Check conditions
						if (
							(routine!.automatedExecution!.conditions!
								.humidityBelow.active && // Check if the condition is active
								routine!.automatedExecution!.conditions!
									.humidityBelow.value! >
									sensorData.humidity) || //
							(routine!.automatedExecution!.conditions!
								.humidityExceeds.active &&
								routine!.automatedExecution!.conditions!
									.humidityExceeds.value! <
									sensorData.humidity) ||
							(routine!.automatedExecution!.conditions!
								.temperatureBelow.active &&
								routine!.automatedExecution!.conditions!
									.temperatureBelow.value! >
									sensorData.temperature) ||
							(routine!.automatedExecution!.conditions!
								.temperatureExceeds.active &&
								routine!.automatedExecution!.conditions!
									.temperatureExceeds.value! <
									sensorData.temperature)
						) {
							await this.executeRoutine(routine as any, board)
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
													.checkInterval *
													1000 *
													60 // Convert minutes to milliseconds
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

	public async executeRoutine(routine: any, board: any) {
		if (routine.actions.notify.active) {
			// Send a notification
			EmailService.getInstance().sendEmail(
				'Routine executed',
				`
				<p>Your routine has been executed.</p>
				<p>Routine name: ${routine.name}</p>
				<p>Board ID: ${routine.boardId}</p>
				<p>Time: ${new Date().toLocaleString()}</p>
				`,
				board.user.email
			)
		}

		if (routine.actions.water.active) {
			// Water the plants
			this.socket
				.getClient()
				.to(`board_${routine.boardId}`)
				.emit('pump', {
					time: routine.actions.notify.amount,
				})
		}

		if (routine.actions.rotatePanel.active) {
			// Rotate the panel
			this.socket
				.getClient()
				.to(`board_${routine.boardId}`)
				.emit('rotate_panel', {
					state: 1,
				})
		}
	}

	public async cleanup() {
		clearInterval(this.intervalId)
		await this.prisma.$disconnect()
	}
}

export default RoutineController
