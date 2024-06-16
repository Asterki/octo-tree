import * as React from "react";
import { Socket, io } from "socket.io-client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from "faker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faPerson,
    faQuestion,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export const options = {
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

const labels = ["Jun 10th", "Jun 11th", "Jun 12th", "Jun 13th", "Jun 14th", "Jun 15th", "Jun 16th"];

export const temperature_data = {
    labels,
    datasets: [
        {
            label: "Historical Data",
            data: labels.map(() =>
                faker.datatype.number({ min: 0, max: 50 })
            ),
            backgroundColor: "rgb(255, 99, 132)",
            stack: "Stack 0",
        },
    ],
};

export const humidity_data = {
    labels,
    datasets: [
        {
            label: "Historical Data",
            data: labels.map(() =>
                faker.datatype.number({ min: 0, max: 100 })
            ),
            backgroundColor: "rgb(255, 99, 132)",
            stack: "Stack 0",
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

            newSocket.on("disconnect", () => {
                console.log("Disconnected from server");
                setSocket(null);
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
                <section className="flex flex-col items-center justify-start gap-2 col-span-2 row-span-1 rounded-md shadow-lg bg-white p-4">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Connection Status</h1>
                    <div
                        className={`${
                            socket == null ? "bg-red-500" : "bg-green-500"
                        } rounded-full h-16 w-16 flex items-center justify-center`}
                    >
                        <FontAwesomeIcon
                            icon={socket !== null ? faCheck : faTimes}
                            className="text-2xl text-white"
                        />
                    </div>
                    <p className="text-center">
                        {socket !== null
                            ? "Connected to the server"
                            : "Disconnected from the host"}
                    </p>

                    <button className="rounded-md shadow-md bg-red-400 p-2 text-white">
                        Disconnect
                    </button>
                </section>

                <section className="flex flex-col items-center justify-start bg-white shadow-lg rounded-md p-2 row-start-2 col-span-2">
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
                </section>

                <section className="flex flex-col items-center justify-start gap-2 col-span-2 bg-white shadow-lg rounded-md p-4">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Panel Angle Control</h1>

                    <button
                        onClick={() => {
                            searchAngle();
                        }}
                        className="px-4 py-2 rounded-md bg-slate-100 shadow-md"
                    >
                        Search Angle
                    </button>
                    <button
                        onClick={() => {
                            searchAngle();
                        }}
                        className="px-4 py-2 rounded-md bg-slate-100 shadow-md"
                    >
                        Search Angle
                    </button>
                </section>

                <section className="flex flex-col justify-between col-start-6 row-start-1 row-span-2 col-span-2 bg-white shadow-lg rounded-md p-4">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Add Routine</h1>

                    <div>
                        <label htmlFor="Routine Name">Routine Name</label>
                        <input
                            type="text"
                            className="bg-slate-100 rounded-md w-full p-2 transition-all mb-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="Routine Name">Routine Time</label>
                        <input
                            type="time"
                            className="bg-slate-100 rounded-md w-full p-2 transition-all mb-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="Routine Name">Action type</label>
                        <select
                            name=""
                            id=""
                            className="bg-slate-100 p-2 rounded-md mb-2 w-full"
                        >
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                            <option value=""></option>
                        </select>
                    </div>

                    <button className="rounded-md shadow-md bg-green-500 p-2 text-white">
                        Add Routine
                    </button>
                </section>

                <section className="flex flex-col col-start-8 row-span-2 col-span-5 bg-white shadow-lg rounded-md p-2 ">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Routines</h1>

                    <div className="flex justify-between items-center p-4 bg-slate-100 rounded-md my-2">
                        <p className="text-lg">Routine 1</p>
                        <button className="bg-red-500 p-2 text-white rounded-md">
                            Delete
                        </button>
                    </div>
                </section>

                <section className="items"></section>

                <section className="col-start-1 row-start-3 col-span-3 row-span-2 bg-white rounded-md shadow-lg p-2">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Temperature</h1>
                    <Line options={options} data={temperature_data} />
                </section>

                <section className="col-start-4 row-start-3 col-span-3 row-span-2 bg-white rounded-md shadow-lg p-2">
                    <h1 className="text-slate-700 text-2xl text-center font-bold">Humidity</h1>
                    <Line options={options} data={humidity_data} />
                </section>

                <section className="col-start-9 row-start-3 col-span-4 row-span-1 bg-white rounded-md shadow-lg p-2">
                    <div className="flex gap-2 h-full">
                        <button className="bg-slate-200 rounded-md w-1/2 h-full">
                            <FontAwesomeIcon
                                icon={faPerson}
                                className="text-3xl"
                            />
                        </button>
                        <button className="bg-slate-200 rounded-md w-1/2 h-full">
                            <FontAwesomeIcon
                                icon={faQuestion}
                                className="text-3xl"
                            />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
