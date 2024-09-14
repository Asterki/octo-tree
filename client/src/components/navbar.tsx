import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NavbarComponent = () => {
    const { t } = useTranslation('components')

    return (
        <div className="absolute top-0 w-full md:flex-row flex-col bg-gray-800 text-white flex items-center justify-between md:px-16 px-4 py-4 md:h-16 h-32 z-30">
            <div className="text-2xl font-bold">
                <Link to="/">{t('navbar.brand')}</Link>
            </div>

            <div className="flex items-center justify-center md:gap-2">
                <div className="group relative">
                    <h1 className="cursor-pointer bg-emerald-600 text-white rounded-md p-2 md:scale-100 scale-90">
                        {t('navbar.aboutApp')}
                    </h1>
                    <div className="flex-col gap-2 top-12 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute w-full">
                        <Link
                            to={'https://asterki.tech'}
                            target="_blank"
                            className="hover:bg-gray-200 p-2 cursor-pointer min-w-auto max-w-screen-sm"
                        >
                            {t('navbar.aboutDeveloper')}
                        </Link>
                        <Link
                            className="hover:bg-gray-200 p-2 cursor-pointer w-full"
                            to={'https://github.com/Asterki/octo-tree'}
                            target="_blank"
                        >
                            {t('navbar.openSource')}
                        </Link>
                        <Link
                            className="hover:bg-gray-200 p-2 cursor-pointer w-full"
                            to="/privacy-policy"
                        >
                            {t('navbar.privacyPolicy')}
                        </Link>
                    </div>
                </div>
                <div className="group relative">
                    <h1 className="cursor-pointer bg-emerald-600 text-white rounded-md p-2 md:scale-100 scale-90">
                        {t('navbar.getOctoTree')}
                    </h1>
                    <div className="flex-col gap-2 top-12 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute  w-full">
                        <nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
                            {t('navbar.notPublic')}
                        </nav>
                        <nav className="hover:bg-gray-200 p-2 cursor-pointer w-full">
                            {t('navbar.shrug')}
                        </nav>
                    </div>
                </div>
                <div className="group relative">
                    <h1 className="cursor-pointer bg-emerald-600 text-white rounded-md p-2 md:scale-100 scale-90">
                        {t('navbar.accountAccess')}
                    </h1>
                    <div className="flex-col gap-2 top-12 shadow-md bg-white text-gray-800 max-h-0 group-hover:max-h-72 overflow-y-hidden transition-all ease-in-out duration-500 flex absolute  w-full">
                        <Link
                            className="hover:bg-gray-200 p-2 cursor-pointer w-full"
                            to="/login"
                        >
                            {t('navbar.login')}
                        </Link>
                        <Link
                            className="hover:bg-gray-200 p-2 cursor-pointer w-full"
                            to={'/register'}
                        >
                            {t('navbar.register')}
                        </Link>
                        <Link
                            className="hover:bg-gray-200 p-2 cursor-pointer w-full"
                            to="/dashboard"
                        >
                            {t('navbar.dashboard')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavbarComponent