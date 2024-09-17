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
						nextExecutionInterval: {
							lte: Date.now(),
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
				},
			})

            // console.log(routines)

			for (const routine of routines) {
				if (routine.execution == "automated") { // Check if the routine is automated
                    // Check if the routine has any conditions
                } 
			}
		}, 5000)
	}
}

export default RoutineController