const FooterComponent = () => {
	return (
		<div className="bg-gray-800 text-white py-4 md:h-16 flex items-center px-16 z-10 absolute bottom-0 w-full">
			<h1 className="text-xl font-bold">Octo-Tree</h1>

			<div className="ml-auto">
				<p>© {new Date().getFullYear()} Octo-Tree</p>
			</div>
		</div>
	)
}

export default FooterComponent
