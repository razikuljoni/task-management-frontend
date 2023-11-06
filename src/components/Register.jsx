import {
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import app from "../configs/firebase.config.js";

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const auth = getAuth(app);

    const onSubmit = async (data) => {
        const imageUploadToken = import.meta.env.VITE_Image_Upload_Token;
        const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${imageUploadToken}`;
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{7,}$/;

        const formData = new FormData();
        formData.append("image", data.photoURL[0]);

        const email = data?.email;
        const name = data?.name;
        const password = data?.password;

        if (data.password !== data.confirm) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Password doesn't match confirm password",
                showConfirmButton: false,
                timer: 2000,
            });
        } else if (data.password.length < 6) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Password must be at least 6 characters",
                showConfirmButton: false,
                timer: 2000,
            });
        } else if (regex.test(data.password) === false) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Password doesn't meet requirements. Password must have 6 or more character at least one Uppercase Letter and one Special character.",
                showConfirmButton: false,
                timer: 2000,
            });
        } else {
            try {
                await fetch(imageHostingUrl, {
                    method: "POST",
                    body: formData,
                })
                    .then((res) => res.json())
                    .then((img) => {
                        if (img.status === 200) {
                            // photoURL = img?.data?.display_url;

                            createUserWithEmailAndPassword(
                                auth,
                                email,
                                password
                            )
                                .then((userCredential) => {
                                    // Signed up
                                    const user = userCredential.user;
                                    updateProfile(auth.currentUser, {
                                        displayName: name,
                                        photoURL: img?.data?.display_url,
                                    })
                                        .then(() => {
                                            Swal.fire({
                                                position: "top-end",
                                                icon: "error",
                                                title: "Profile Updated",
                                                showConfirmButton: false,
                                                timer: 2000,
                                            });
                                            navigate("/");
                                        })
                                        .catch((error) => {
                                            Swal.fire({
                                                position: "top-end",
                                                icon: "error",
                                                title: error.message,
                                                showConfirmButton: false,
                                                timer: 2000,
                                            });
                                        });
                                })
                                .catch((error) => {
                                    Swal.fire({
                                        position: "top-end",
                                        icon: "error",
                                        title: error.message,
                                        showConfirmButton: false,
                                        timer: 2000,
                                    });
                                });
                        }
                    });
            } catch (error) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        }
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(() => {
                navigate("/");
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Google Login Successfull!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    const handleGithubLogin = () => {
        signInWithPopup(auth, githubProvider)
            .then(() => {
                navigate("/");
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Github Login Successfull!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, facebookProvider)
            .then(() => {
                navigate("/");
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Facebook Login Successfull!",
                    showConfirmButton: false,
                    timer: 2000,
                });
            })
            .catch((error) => {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 mx-auto md:pt-0 xs:p-0 md:w-full md:max-w-md">
                <h1 className="mb-5 text-3xl font-bold text-center ">
                    Please Register
                </h1>
                <div className="bg-white shadow w-full rounded-lg divide-gray-200">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="px-5 pt-7"
                    >
                        <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Please Enter Your Full-Name"
                            className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg "
                            required
                        />
                        <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                            E-mail
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Please Enter Your Email"
                            className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg "
                            required
                        />
                        <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Please Enter Your Password"
                            className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg "
                            required
                        />

                        <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                            Confirm Password
                        </label>
                        <input
                            {...register("confirm")}
                            type="password"
                            placeholder="Please Re-Enter Your Password"
                            className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg "
                            required
                        />
                        <label className="block pb-1 text-sm font-semibold text-gray-600 ">
                            Photo URL
                        </label>
                        <input
                            {...register("photoURL", { required: true })}
                            type="file"
                            className="w-full px-3 py-2 mt-1 mb-5 text-sm border rounded-lg "
                        />
                        {errors.photoURL && (
                            <span className="block mb-2 text-error">
                                This field is required. Please Upload your photo
                            </span>
                        )}

                        <button
                            type="submit"
                            className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        >
                            <span className="inline-block mr-2">Register</span>
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
                    <div className="p-0 m-0 ">
                        <p className="mt-6 text-sm text-center text-gray-400 ">
                            Already have an account yet?{" "}
                            <Link
                                to="/login"
                                className="text-blue-500 focus:outline-none focus:underline hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                    <div className="mt-2 text-center">
                        <div className="inline-flex items-center justify-center w-full">
                            <hr className="w-full h-px bg-gray-200 border-1 " />
                            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                                OR Continue With
                            </span>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-3 gap-1">
                            <button
                                onClick={handleFacebookLogin}
                                type="button"
                                className="transition duration-200 border  border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
                            >
                                Facebook
                            </button>
                            <button
                                onClick={handleGoogleLogin}
                                type="button"
                                className="transition duration-200 border  border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
                            >
                                Google
                            </button>
                            <button
                                onClick={handleGithubLogin}
                                type="button"
                                className="transition duration-200 border  border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
                            >
                                Github
                            </button>
                        </div>
                    </div>
                    <div className="py-5">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                <button className="px-5 py-4 mx-5 text-sm font-normal text-gray-500 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="inline-block w-4 h-4 align-text-top"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="inline-block ml-1">
                                        Forgot Password
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-5">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="text-center sm:text-left whitespace-nowrap">
                            <button className="px-5 py-4 mx-5 text-sm font-normal text-gray-500 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="inline-block w-4 h-4 align-text-top"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                <Link to="/" className="inline-block ml-1">
                                    Back To Home
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
