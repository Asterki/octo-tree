import * as React from 'react'

interface AlertProps {
	content: string
}

const AlertComponent: React.FC<AlertProps> = ({ content }) => {
	return (
		<div className="bottom-2 left-2 fixed bg-emerald-700 text-white p-4 rounded-md shadow-md">
			{content}
		</div>
	)
}

export default AlertComponent
