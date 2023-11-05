import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom/dist";
import Swal from "sweetalert2";
import "./App.css";
import { useNavigate } from "react-router-dom/dist";

// eslint-disable-next-line react/prop-types
function App({ children }) {
    const [user, setUser] = useState();
    const auth = getAuth();
    const navigate = useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user?.auth?.currentUser);
            } else {
                // User is signed out
                // ...
            }
        });
    }, [auth]);

    const handleSignOut = (e) => {
        e.preventDefault();

        if(!user){
          return navigate("/login");
        }

        signOut(auth)
            .then(() => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "LogOut Successfully!",
                    showConfirmButton: false,
                    timer: 2000,
                });
                setUser(null);
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
        <>
            <header className="text-gray-600 body-font bg-gray-300">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <img
                            className="rounded-full h-10 w-10 ring-2"
                            src={`${
                                user
                                    ? user?.photoURL
                                    : "https://source.unsplash.com/100x100/?portrait"
                            }`}
                            alt="User"
                        />
                        <span className="ml-3 text-xl">
                            {user ? user?.displayName : "Please Login"}
                        </span>
                    </a>
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link
                            to="/add-task"
                            className="mr-5 hover:text-gray-900"
                        >
                            Add Task
                        </Link>
                        <Link
                            to="/complete-tasks"
                            className="mr-5 hover:text-gray-900"
                        >
                            Complete Task
                        </Link>
                    </nav>
                    <button
                        className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                        onClick={(e) => handleSignOut(e)}
                    >
                        {user ? "LogOut" : <Link to="/login">Login</Link>}
                        <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4 ml-1"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </header>
            {children}
        </>
    );
}

export default App;
