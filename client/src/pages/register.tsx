import * as React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const passwordRef = React.useRef<HTMLInputElement>(null);
    const repeatPasswordRef = React.useRef<HTMLInputElement>(null);

    const register = async () => {
        const password = passwordRef.current?.value;
        const repeatPassword = repeatPasswordRef.current?.value;

        if (password !== repeatPassword) {
            return alert("Passwords do not match!");
        }

        try {
            interface RegisterResponse {
                success: boolean;
            }
            const response = await axios.post<RegisterResponse>(
                "http://localhost:5000/api/access/register-admin",
                {
                    password: password,
                }
            );

            if (response.data.success == true) return navigate("/login");
            else alert("An error occurred");
        } catch (error) {
            console.error(error);
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
                        token: token
                    },
                });

                if (tokenResponse.data.status == true)
                    return navigate("/dashboard");
            }

            const response = await axios({
                url: "http://127.0.0.1:5000/api/access/verify-admin",
                method: "GET",
            });

            // Check if the admin user is already registered, if so, redirect to login page
            if (response.data.status == true)
                return navigate("/login");
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
                    <h1 className="text-3xl font-bold text-center">
                        Register your admin account
                    </h1>
                    <div className="flex flex-col items-center mt-4">
                        <input
                            type="text"
                            ref={passwordRef}
                            placeholder="Password"
                            className="p-2 border border-neutral-200 rounded-md w-80"
                        />
                        <input
                            type="password"
                            ref={repeatPasswordRef}
                            placeholder="Repeat Password"
                            className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
                        />
                        <button
                            type="button"
                            onClick={register}
                            className="bg-emerald-700 text-white w-80 p-2 rounded-md mt-4"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Register;
