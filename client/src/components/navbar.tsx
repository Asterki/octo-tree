import { Link } from 'react-router-dom'

const NavbarComponent = () => {
	return (
		<div className="absolute top-0 w-full md:flex-row flex-col  bg-gray-700 text-white flex items-center justify-between md:px-16 px-4 py-4 md:h-16 h-32">
			<div className="text-2xl font-bold">
				<h1>Octo-Tree</h1>
			</div>

			<div className="flex items-center justify-center md:gap-2">
				<div className="group relative">
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2 md:scale-100 scale-90">
						About the App
					</h1>
					<div className="flex-col gap-2 top-16 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute w-full">
						<Link
							to={'https://asterki.tech'}
							target="_blank"
							className="hover:bg-gray-200 p-2 cursor-pointer min-w-auto max-w-screen-sm"
						>
							About the developer
						</Link>
						<Link
							className="hover:bg-gray-200 p-2 cursor-pointer w-full"
							to={'https://github.com/Asterki/octo-tree'}
							target="_blank"
						>
							Open source
						</Link>
						<Link
							className="hover:bg-gray-200 p-2 cursor-pointer w-full"
							to="/privacy-policy"
						>
							Privacy policy
						</Link>
					</div>
				</div>
				<div className="group relative">
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2 md:scale-100 scale-90">
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
					<h1 className="cursor-pointer bg-emerald-600 rounded-md p-2 md:scale-100 scale-90">
						Account Access
					</h1>
					<div className="flex-col gap-2 top-16 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute  w-full">
						<Link
							className="hover:bg-gray-200 p-2 cursor-pointer w-full"
							to="/login"
						>
							Login
						</Link>
						<Link
							className="hover:bg-gray-200 p-2 cursor-pointer w-full"
							to={'/register'}
						>
							Register
						</Link>
						<Link
							className="hover:bg-gray-200 p-2 cursor-pointer w-full"
							to="/dashboard"
						>
							Dashboard
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavbarComponent
