import * as React from "react";
import { Socket, io } from "socket.io-client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    plugins: {
        title: {
            display: true,
            text: "Chart.js Bar Chart - Stacked",
        },
    },
    responsive: true,
    interaction: {
        mode: "index" as const,
        intersect: false,
    },
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
    labels,
    datasets: [
        {
            label: "Dataset 1",
            data: labels.map(() =>
                faker.datatype.number({ min: -1000, max: 1000 })
            ),
            backgroundColor: "rgb(255, 99, 132)",
            stack: "Stack 0",
        },
        {
            label: "Dataset 2",
            data: labels.map(() =>
                faker.datatype.number({ min: -1000, max: 1000 })
            ),
            backgroundColor: "rgb(75, 192, 192)",
            stack: "Stack 0",
        },
        {
            label: "Dataset 3",
            data: labels.map(() =>
                faker.datatype.number({ min: -1000, max: 1000 })
            ),
            backgroundColor: "rgb(53, 162, 235)",
            stack: "Stack 1",
        },
    ],
};

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
        socket.emit("relay", { relay: relay, value: value });
    };

    const searchAngle = async () => {
        if (socket === null) return;
        socket.emit("angle", { value: 1 });
    };

    return (
        <div className="bg-neutral-100 min-h-screen text-neutral-600">
            {/* Navbar */}
            <div className="bg-emerald-700 shadow-md text-white col-span-full row-span-1 flex items-center justify-between px-4">
                <h1 className="text-3xl font-bold p-4">Octo Tree</h1>
            </div>

            <main className="grid grid-cols-12 grid-rows-12 gap-4 p-4">
                <div className="flex flex-col items-center justify-center gap-2 col-span-2 row-span-1 rounded-md p-2 shadow-lg bg-white">
                    <p className="text-2xl">Connected to host:</p>
                    <div
                        className={`${
                            socket !== null ? "bg-red-500" : "bg-green-500"
                        } rounded-full h-16 w-16 flex items-center justify-center`}
                    >
                        <FontAwesomeIcon
                            icon={socket !== null ? faCheck : faTimes}
                            className="text-2xl text-white"
                        />
                    </div>
                    <p className="text-center">
                        Connection stablished with websocket at
                        https://192.168.0.14:5500
                    </p>

                    <button className="rounded-md shadow-md bg-red-400 p-2 text-white">
                        Disconnect
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-md p-2 row-start-2 col-span-2">
                    <h1 className="text-2xl font-bold text-center">
                        IoT Relay Control
                    </h1>
                    <div className="flex gap-2">
                        <label htmlFor="Turn on light">Relay 1</label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onClick={(event) => {
                                update(1, !event.currentTarget.checked ? 1 : 0);
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label htmlFor="Turn on light">Relay 2</label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onClick={(event) => {
                                update(2, !event.currentTarget.checked ? 1 : 0);
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label htmlFor="Turn on light">Relay 3</label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onClick={(event) => {
                                update(3, !event.currentTarget.checked ? 1 : 0);
                            }}
                        />
                    </div>

                    <div className="flex gap-2">
                        <label htmlFor="Turn on light">Relay 4</label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onClick={(event) => {
                                update(4, !event.currentTarget.checked ? 1 : 0);
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            searchAngle();
                        }}
                        className="px-4 py-2 rounded-md bg-white shadow-md"
                    >
                        Search Angle
                    </button>
                </div>

                <div className="col-start-1 row-start-3 col-span-3 row-span-2 bg-white rounded-md shadow-lg p-2">
                    <Bar options={options} data={data} />;
                </div>
            </main>
        </div>
    );
}

export default App;
