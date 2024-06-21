const LoginPage = () => {
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
                            type="text"
                            placeholder="Username"
                            className="p-2 border border-neutral-200 rounded-md w-80"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="p-2 border border-neutral-200 rounded-md w-80 mt-2"
                        />
                        <button
                            type="submit"
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
