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
import { faCheck, faPerson, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons";

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
            text: "Stacked dataset - Production",
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
                <section className="flex flex-col items-center justify-center gap-2 col-span-2 row-span-1 rounded-md shadow-lg bg-white p-4">
                    <p className="text-2xl">Connected to host:</p>
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

                <section className="flex flex-col items-center justify-center bg-white shadow-lg rounded-md p-2 row-start-2 col-span-2">
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

                <section className="flex gap-2">
                    <button
                        onClick={() => {
                            searchAngle();
                        }}
                        className="px-4 py-2 rounded-md bg-white shadow-md"
                    >
                        Search Angle
                    </button>
                </section>

                <section className="flex flex-col justify-between col-start-6 row-start-1 row-span-2 col-span-2 bg-white shadow-lg rounded-md p-4">
                    <h1 className="text-2xl text-center">Add Routine</h1>

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
                    <h1 className="text-2xl text-center">Routines</h1>

                    <div className="flex justify-between items-center p-4 bg-slate-100 rounded-md my-2">
                        <p className="text-lg">Routine 1</p>
                        <button className="bg-red-500 p-2 text-white rounded-md">
                            Delete
                        </button>
                    </div>
                </section>

                <section className="items"></section>

                <section className="col-start-1 row-start-3 col-span-3 row-span-2 bg-white rounded-md shadow-lg p-2">
                    <Bar options={options} data={data} />;
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
