import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
const AddTask = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [data, setData] = useState([]);
    const [updateTask, setUpdateTask] = useState(false);
    const [updateTaskId, setUpdateTaskId] = useState("");
    const [userId, setUserId] = useState("");

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user?.auth?.currentUser?.displayName);
                setEmail(user?.auth?.currentUser?.email);
            } else {
                // User is signed out
                // ...
            }
        });

        fetch("http://localhost:8000/users_data")
            .then((res) => res.json())
            .then((data) => setData(data));
        setUserId(data[0]?._id);
    }, [auth, data]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const task = {
            user_name: name,
            user_email: email,
            task_name: data.task_name,
            task_description: data.task_description,
        };

        if (!updateTask) {
            //Post new task
            fetch("http://localhost:8000/users_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(task),
            });
            reset();
        } else {

            fetch(
                `http://localhost:8000/users_data/${updateTaskId}?userId=${userId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(task),
                }
            );
            reset();
            setUpdateTask(false)
        }
    };



    // Handle Edit Task
    const handleEditTask = (id) => {
        fetch(`http://localhost:8000/users_data/${id}?userId=${data[0]._id}`)
            .then((res) => res.json())
            .then((data) => setUpdateTask(data));
        setUpdateTaskId(id);
    };

    // Handle Delete Task
    const handleDeleteTask = (id) => {
        fetch(`http://localhost:8000/users_data/${id}?userId=${data[0]._id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
    };

    return (
        <div className="w-full md:w-[500px] mx-auto">
            <section className="text-gray-600 body-font">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="container px-5 pb-2 mx-auto flex flex-wrap items-center"
                >
                    <div className=" bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                            Add A New Task
                        </h2>
                        <div className="relative mb-4">
                            <label
                                htmlFor="full-name"
                                className="leading-7 text-sm text-gray-600"
                            >
                                Task
                            </label>
                            <input
                                onClick={(e) => e.target.value}
                                defaultValue={updateTask?.task_name}
                                type="text"
                                id="full-name"
                                placeholder="Task Name"
                                
                                {...register("task_name", { required: true })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="relative mb-4">
                            <label
                                htmlFor="description"
                                className="leading-7 text-sm text-gray-600"
                            >
                                Task Description
                            </label>
                            <textarea
                                defaultValue={updateTask?.task_description}
                                type="text"
                                id="description"
                                placeholder="Task Description"
                                {...register("task_description")}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            {updateTask ? "Update Task" : "Add Task"}
                        </button>
                    </div>
                </form>
            </section>

            <>
                {data[0]?.tasks.map((task, index) => {
                    return (
                        <div key={index} className="p-2 w-full">
                            <div className="bg-gray-100 rounded flex justify-between items-center p-4 h-full ">
                                <div className="flex items-center">
                                    <div className="">
                                        <h2 className="title-font font-medium sm:text-2xl text-3xl text-gray-900">
                                            Task: {task.task_name}
                                        </h2>
                                        <p className="leading-relaxed">
                                            Description: {task.task_description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-600 body-font">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2 ">
                                            <div
                                                className="bg-gray-300 p-2 rounded-full cursor-pointer"
                                                title="mark as done"
                                                onClick={() =>
                                                    handleTaskDone(task?.id)
                                                }
                                            >
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="3"
                                                    className="text-indigo-500 w-6 h-6 flex-shrink-0 "
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                                    <path d="M22 4L12 14.01l-3-3"></path>
                                                </svg>
                                            </div>
                                            <div
                                                className="bg-gray-300 p-2 rounded-full cursor-pointer"
                                                title="Edit Task"
                                                onClick={() =>
                                                    handleEditTask(task?.id)
                                                }
                                            >
                                                <svg
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="3"
                                                    className="text-green-500 w-6 h-6 flex-shrink-0 "
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <div
                                                className="bg-gray-300 p-2 rounded-full cursor-pointer"
                                                title="Delete Task"
                                                onClick={() =>
                                                    handleDeleteTask(task?.id)
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
                    );
                })}
            </>
        </div>
    );
};
export default AddTask;
