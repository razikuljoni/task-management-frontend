import { useForm } from "react-hook-form";

const AddTask = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => console.log(data);

    return (
        <div className="w-full md:w-96 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="px-5 pt-7">
                <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                    E-mail
                </label>
                <input
                    type="text"
                    {...register("task_name", { required: true })}
                    placeholder="Please Enter Your Email"
                    className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg  
                    "
                    required
                />
                <p>{errors.task_name && <span>Task Name is required</span>}</p>
                <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                    Task Description
                </label>
                <textarea
                    type="text"
                    {...register("task_description")}
                    placeholder="Please Enter Your Password"
                    className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg"
                    required
                />
                <button
                    type="submit"
                    className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                    <span className="inline-block mr-2">Add Task </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="inline-block w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
};
export default AddTask;
