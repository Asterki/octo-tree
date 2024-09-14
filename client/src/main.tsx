import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import DashboardPage from './pages/dashboard.tsx'
import IndexPage from './pages/home.tsx'
import PrivacyPolicy from './pages/privacy.tsx'

import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

import store from './store'
import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Language JSON Files
import enCommon from './translations/en/common.json'
import enComponents from './translations/en/components.json'

import esCommon from './translations/en/common.json'
import esComponents from './translations/en/components.json'

import frCommon from './translations/fr/common.json'
import frComponents from './translations/fr/components.json'

import deCommon from './translations/de/common.json'
import deComponents from './translations/de/components.json'

i18next.init({
	interpolation: { escapeValue: false }, // React already does escaping
	initImmediate: false,
	lng: 'en',
	// Import resources from the JSON Files
	resources: {
		en: {
			common: enCommon,
			components: enComponents,
		},
		es: {
			common: esCommon,
			components: esComponents,
		},
		fr: {
			common: frCommon,
			components: frComponents,
		},
		de: {
			common: deCommon,
			components: deComponents,
		},
	},
})

const router = createBrowserRouter([
	{
		path: '/',
		element: <IndexPage />,
	},
	{
		path: '/dashboard',
		element: <DashboardPage />,
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/privacy-policy',
		element: <PrivacyPolicy />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18next}>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</I18nextProvider>
	</React.StrictMode>
)
