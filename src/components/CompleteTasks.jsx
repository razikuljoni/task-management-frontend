import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "../configs/firebase.config";

const CompleteTasks = () => {
    const [user, setUser] = useState();
    const [data, setData] = useState([]);

    const auth = getAuth(app);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user?.auth?.currentUser);
            } else {
                console.log("User is signed out");
            }
        });

        fetch("https://task-management-rust-two.vercel.app/users_data")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [auth, data]);

    const handleDeleteTask = (id) => {
        fetch(
            `https://task-management-rust-two.vercel.app/users_data/${id}?userId=${data[0]._id}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }
        );
    };

    return (
        <div>
            <>
                {user ? (
                    data[0]?.tasks.map((task, index) => {
                        return (
                            task?.status === "complete" && (
                                <div key={index} className="p-2 w-full">
                                    <div className="bg-gray-100 rounded flex justify-between items-center p-4 h-full ">
                                        <div className="text-start">
                                            <h2 className="title-font font-medium sm:text-2xl text-3xl text-gray-900">
                                                Task:{" "}
                                                {task.status === "complete" ? (
                                                    <del>{task.task_name}</del>
                                                ) : (
                                                    task.task_name
                                                )}
                                            </h2>
                                            <p className="leading-relaxed">
                                                Description:{" "}
                                                {task.task_description}
                                            </p>
                                        </div>
                                        <div className="text-gray-600 body-font">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2 ">
                                                    <div
                                                        className="bg-gray-300 p-2 rounded-full cursor-pointer"
                                                        title="Delete Task"
                                                        onClick={() =>
                                                            handleDeleteTask(
                                                                task?.id
                                                            )
                                                        }
                                                    >
                                                        <svg
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="3"
                                                            className="text-red-500 w-6 h-6 flex-shrink-0 "
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        );
                    })
                ) : (
                    <div>
                        <h2 className="title-font text-center font-medium sm:text-2xl text-3xl text-gray-900">
                            Please Login First.
                        </h2>
                    </div>
                )}
                {user && data[0]?.tasks.length === 0 && (
                    <div>
                        <h2 className="title-font text-center font-medium sm:text-2xl text-3xl text-gray-900">
                            No Completed Task
                        </h2>
                    </div>
                )}
            </>
        </div>
    );
};
export default CompleteTasks;
