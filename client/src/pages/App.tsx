import * as React from "react";
import { Socket, io } from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

function App() {
    const [socket, setSocket] = React.useState<Socket | null>(null);

    React.useEffect(() => {
        (async () => {
            let newSocket = io("http://127.0.0.1:5000", {
                autoConnect: true,
            })

            newSocket.on("connect", () => {
                console.log("Connected to server");
                setSocket(newSocket);
            });
        })();
    }, []);

    const random = async () => {
        if (socket === null) return;
        socket.emit("random", { value: Math.random() });
    }


    return (
        <div className="bg-green-500 min-h-screen flex items-center justify-center flex-col">
            <div className="rounded-full w-32 h-32 bg-white flex items-center justify-center animate-pulse shadow-md">
                <FontAwesomeIcon
                    icon={socket !== null ? faCheck : faTimes}
                    className={`text-6xl ${
                        socket !== null ? "text-green-500" : "text-red-500"
                    }`}
                />

            </div>
            <button className="my-2 bg-white rounded-md shadow-md p-2" onClick={random}>random</button>
        </div>
    );
}

export default App;
