const NavbarComponent = () => {
	return (
		<div className="absolute top-0 w-full bg-gray-700 text-white flex items-center justify-between md:px-16 px-4 py-4 md:h-16 h-20">
			<div className="text-2xl font-bold">
				<h1>Octo-Tree</h1>
			</div>

			<div className="flex items-center justify-center gap-2">
				<div className="group relative">
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2">
						About the App
					</h1>
					<div className="flex-col gap-2 top-16 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute w-full">
						<nav
							className="hover:bg-gray-200 p-2 cursor-pointer min-w-auto max-w-screen-sm"
						>
							About the developer
						</nav>
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							Open source
						</nav>
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							Privacy policy
						</nav>
					</div>
				</div>
				<div className="group relative">
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2">
						Get an Octo-Tree
					</h1>
					<div className="flex-col gap-2 top-16 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute  w-full">
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							Still not public
						</nav>
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							¯\_(ツ)_/¯
						</nav>
	
					</div>
				</div>
				<div className="group relative">
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2">
						Account Access
					</h1>
					<div className="flex-col gap-2 top-16 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute  w-full">
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							Login
						</nav>
						<nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
							Register
						</nav>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavbarComponent
