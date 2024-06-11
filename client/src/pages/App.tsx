import * as React from "react";
import { Socket, io } from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function App() {
    const [socket, setSocket] = React.useState<Socket | null>(null);

    React.useEffect(() => {
        (async () => {
            const newSocket = io("http://localhost:5000", {
                autoConnect: true,
            });

            newSocket.on("connect", () => {
                console.log("Connected to server");
                setSocket(newSocket);
            });
        })();
    }, []);

    const update = async (relay: number, value: number) => {
        if (socket === null) return;
        socket.emit("relay", { relay: relay, value: value })
    };

    const searchAngle = async () => {
        if (socket === null) return;
        socket.emit("angle", { value: 1 })
    }

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
                <label htmlFor="Turn on light" className="text-white">
                    Relay 1
                </label>
                <input
                    type="checkbox"
                    defaultChecked={true}
                    onClick={(event) => {
                        update(1, !event.currentTarget.checked ? 1 : 0)
                    }}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <label htmlFor="Turn on light" className="text-white">
                    Relay 2
                </label>
                <input
                    type="checkbox"
                    defaultChecked={true}
                    onClick={(event) => {
                        update(2, !event.currentTarget.checked ? 1 : 0)
                    }}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <label htmlFor="Turn on light" className="text-white">
                    Relay 3
                </label>
                <input
                    type="checkbox"
                    defaultChecked={true}
                    onClick={(event) => {
                        update(3, !event.currentTarget.checked ? 1 : 0)
                    }}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <label htmlFor="Turn on light" className="text-white">
                    Relay 4
                </label>
                <input
                    type="checkbox"
                    defaultChecked={true}
                    onClick={(event) => {
                        update(4, !event.currentTarget.checked ? 1 : 0)
                    }}
                />
            </div>

            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => {
                        searchAngle()
                    }}
                    className="bg-white text-gray-800 px-4 py-2 rounded-md"
                >
                    Search Angle
                </button>
            </div>
        </div>
    );
}

export default App;
