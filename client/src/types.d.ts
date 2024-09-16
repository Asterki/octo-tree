interface Routine {
	id: number
	name: string
	execution: string
	boardId: string
	automatedExecution: {
		checkInterval: number
		nextExecutionInterval: number
		conditions: {
			temperatureExceeds: {
				active: boolean
				value: number
			}
			temperatureBelow: {
				active: boolean
				value: number
			}
			humidityExceeds: {
				active: boolean
				value: number
			}
			humidityBelow: {
				active: boolean
				value: number
			}
		}
	}
	actions: {
		water: {
			active: boolean
			amount: number
		}
		rotatePanel: {
			active: boolean
		}
		notify: {
			active: boolean
		}
	}
}

export type { Routine }
