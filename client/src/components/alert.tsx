import * as React from 'react'

interface AlertProps {
	content: string
	showing: boolean
	setShowing: React.Dispatch<
		React.SetStateAction<{
			show: boolean
			content: string
		}>
	>
}

const AlertComponent: React.FC<AlertProps> = ({
	content,
	showing,
	setShowing,
}) => {
	return (
		<div
			onClick={() =>
				setShowing({
					show: false,
					content: '',
				})
			}
			className={`bottom-2 left-2 fixed bg-emerald-700 text-white p-4 rounded-md shadow-md ${
				showing ? 'block' : 'hidden'
			}`}
		>
			{content}
		</div>
	)
}

export default AlertComponent
