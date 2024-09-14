import * as React from 'react'
import axios from 'axios'
import validator from "validator"

import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/pages'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import NavbarComponent from '../components/navbar'
import AlertComponent from '../components/alert'

const Register = () => {
    const navigate = useNavigate()
    const { t } = useTranslation('common')

    const user = useAppSelector((state) => state.page.user)
    const dispatch = useAppDispatch()

    const productIDRef = React.useRef<HTMLInputElement>(null)
    const emailRef = React.useRef<HTMLInputElement>(null)
    const passwordRef = React.useRef<HTMLInputElement>(null)
    const repeatPasswordRef = React.useRef<HTMLInputElement>(null)

    const [alertState, setAlertState] = React.useState({
        show: false,
        content: '',
    })

    const showAlert = (content: string) => {
        setAlertState({
            show: true,
            content,
        })

        setTimeout(() => {
            setAlertState({
                show: false,
                content: '',
            })
        }, 3000)
    }

    const register = async () => {
        const password = passwordRef.current?.value
        const repeatPassword = repeatPasswordRef.current?.value

        if (password !== repeatPassword) {
            showAlert(t('register.passwordsDoNotMatch'))
            return
        }

        if (!validator.isStrongPassword(password!)) {
            showAlert(t('register.passwordNotStrongEnough'))
            return
        }

        try {
            const response = await axios.post(
                `${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : ""}/api/accounts/register`,
                {
                    productID: productIDRef.current?.value,
                    email: emailRef.current?.value,
                    password,
                },
                {
                    withCredentials: true,
                }
            )

            if (response.data.status == "success") return navigate('/dashboard')
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 400) {
                    if (error.response.data.status == 'user-exists') {
                        showAlert(t('register.userAlreadyExists'))
                    } else if (
                        error.response.data.status == 'product-not-found'
                    ) {
                        showAlert(t('register.invalidProductID'))
                    } else {
                        showAlert(t('register.fillAllFields'))
                    }
                } else {
                    showAlert(t('register.somethingWentWrong'))
                }
            }
        }
    }

    React.useEffect(() => {
        ;(async () => {
            if (user) {
                navigate('/dashboard')
            } else {
                // Get the user's data
                const response = await axios({
                    url: `${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL : ""}/api/accounts/me`,
                    method: 'get',
                    withCredentials: true,
                })

                dispatch(setUser(response.data))
                navigate('/dashboard')
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="bg-neutral-100 min-h-screen text-neutral-600">
            {/* Navbar */}
            <NavbarComponent />

            <main className="min-h-screen flex items-center justify-center">
                <form className="md:w-3/12 w-11/12">
                    <h1 className="text-3xl font-bold text-center">
                        {t('register.registerAccountTitle')}
                    </h1>
                    <p className="text-center">
                        {t('register.registerAccountDescription')}
                    </p>

                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="text"
                            ref={productIDRef}
                            placeholder={t('register.productID')}
                            className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
                        />
                        <input
                            type="email"
                            ref={emailRef}
                            placeholder={t('register.email')}
                            className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
                        />
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder={t('register.password')}
                            className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
                        />
                        <input
                            type="password"
                            ref={repeatPasswordRef}
                            placeholder={t('register.confirmPassword')}
                            className="p-2 border border-neutral-200 rounded-md w-full mt-2 focus:border-emerald-600 transition-all outline-emerald-600"
                        />
                        <button
                            type="button"
                            onClick={register}
                            className="bg-emerald-700 text-white w-full p-2 rounded-md mt-4 hover:brightness-110 transition-all"
                        >
                            {t('register.register')}
                        </button>
                    </div>

                    <p className="mt-2 text-center">
                        {t('register.alreadyHaveAccountPreLink')}
                        <Link to="/login" className="text-emerald-700">
                            {t('register.alreadyHaveAccountLink')}
                        </Link>
                    </p>
                </form>
            </main>

            <AlertComponent
                content={alertState.content}
                showing={alertState.show}
                setShowing={setAlertState}
            />
        </div>
    )
}

export default Register