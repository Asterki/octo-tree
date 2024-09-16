interface Routine {
	name: string
	execution: 'manual' | 'automated'
	automatedExecution?: {
		conditions: {
			temperatureexceeds: {
				active: boolean
				value: number
			}
			temperaturebelow: {
				active: boolean
				value: number
			}
			humidityexceeds: {
				active: boolean
				value: number
			}
			humiditybelow: {
				active: boolean
				value: number
			}
		}
		checkInterval: number
		nextExecutionInterval: number
	}
	actions: {
		water: {
			active: boolean
			amount: number
		}
		rotatepanel: {
			active: boolean
		}
		notify: {
			active: boolean
		}
	}
}

export type { Routine }
