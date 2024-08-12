import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            // Check if the user is already logged in
            const token = localStorage.getItem("token");
            if (token) {
                // Verify that the token is valid
                interface TokenResponse {
                    status: boolean;
                }
                const tokenResponse = await axios.get<TokenResponse>(
                    "http://localhost:5000/api/access/verify-session",
                    {
                        token: token,
                    }
                );

                if (tokenResponse.data.status == true)
                    return navigate("/dashboard");
                return navigate("/login");
            }

            return navigate("/login");
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <p>Loading...</p>;
};

export default IndexPage;
