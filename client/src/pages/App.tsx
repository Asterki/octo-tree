import * as React from "react";

import axios from "axios";

function App() {
    const [connectedToServer, setcConnectedToServer] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_PORT}/`
            );

            console.log(response);

            if (response.status === 200) {
                setcConnectedToServer(true);
            } else {
                setcConnectedToServer(false);
            }
        })();
    }, []);

    return (
        <>
            <h1>
                {connectedToServer
                    ? "Connected to server"
                    : "Not connected to server"}
            </h1>
        </>
    );
}

export default App;
