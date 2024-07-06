import * as React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const passwordRef = React.useRef<HTMLInputElement>(null);

    const login = async () => {
        try {
            interface LoginResponse {
                token: string | false;
            }
            const response = await axios<LoginResponse>({
                url: "http://localhost:5000/api/access/login",
                method: "POST",
                data: {
                    password: passwordRef.current?.value,
                },
            });

            if (response.status == 200 && response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
            } else {
                alert("Incorrect credentials!");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status == 401) {
                    alert("Incorrect credentials!");
                } else {
                    alert("An error occurred. Please try again later.");
                }
            }
        }
    };

    React.useEffect(() => {
        (async () => {
            // Check if the user is already logged in
            const token = localStorage.getItem("token");
            if (token) {
                // Verify that the token is valid
                interface TokenResponse {
                    status: boolean;
                }
                const tokenResponse = await axios<TokenResponse>({
                    url: "http://localhost:5000/api/access/verify-session",
                    method: "POST",
                    data: {
                        token: token,
                    },
                });

                if (tokenResponse.data.status == true)
                    return navigate("/dashboard");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-neutral-100 min-h-screen text-neutral-600">
            {/* Navbar */}
            <div className="bg-emerald-700 shadow-md text-white w-full flex items-center justify-between px-4 absolute top-0">
                <h1 className="text-3xl font-bold p-4">Octo Tree</h1>
            </div>

            <main className="min-h-screen flex items-center justify-center">
                <form action="">
                    <h1 className="text-3xl font-bold text-center">Login</h1>
                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="password"
                            ref={passwordRef}
                            placeholder="Password"
                            className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
                        />
                        <button
                            type="button"
                            onClick={login}
                            className="bg-emerald-700 text-white w-80 p-2 rounded-md mt-4"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default LoginPage;
