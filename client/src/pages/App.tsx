import * as React from "react";
import { Socket, io } from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const [value, setValue] = React.useState<boolean>(true);

    React.useEffect(() => {
        (async () => {
            const newSocket = io("http://192.168.0.12:5000", {
                autoConnect: true,
            });

            newSocket.on("connect", () => {
                console.log("Connected to server");
                setSocket(newSocket);
            });
        })();
    }, []);

    const random = async () => {
        if (socket === null) return;

        console.log("Sent light");
        socket.emit("light", { value: value ? "on" : "off" });
        setValue(!value);
    };

    return (
        <div className="bg-gray-800 min-h-screen flex items-center justify-center flex-col">
            <div className="flex items-center gap-2">
                <p className="text-white">Connected to host:</p>
                <div className="rounded-full w-8 h-8 bg-white flex items-center justify-center animate-pulse shadow-md">
                    <FontAwesomeIcon
                        icon={socket !== null ? faCheck : faTimes}
                        className={`text-2xl ${
                            socket !== null ? "text-green-500" : "text-red-500"
                        }`}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <label htmlFor="Turn on light" className="text-white">Turn on light</label>
                <input type="checkbox" defaultChecked={value} onClick={random} />
            </div>
        </div>
    );
}

export default App;
