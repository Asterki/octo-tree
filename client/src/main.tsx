import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/globals.css'

import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import DashboardPage from './pages/dashboard.tsx'
import IndexPage from './pages/home.tsx'
import PrivacyPolicy from './pages/privacy.tsx'

import store from './store'
import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
)
