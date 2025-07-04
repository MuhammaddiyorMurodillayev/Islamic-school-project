import { message } from "antd";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Agar React Router ishlatyapsiz

interface AdminLoginProps {
    setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminLogin = ({ setAdmin }: AdminLoginProps) => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const userNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate(); // Back to Home uchun

    const checkAdmin = () => {
        if (userName === 'usernameforalquranschool.net' && password === '09ac0bcc-34d5-478b-bd64-25918eaee5e3') {
            setAdmin(true)
        }
        else {
            message.error(' Password or Username incorrect!!');
        }
        // console.log("Login", userName, password);
    };

    const clearInputs = () => {
        setUserName("");
        setPassword("");
        if (userNameRef.current) userNameRef.current.value = "";
        if (passwordRef.current) passwordRef.current.value = "";
        userNameRef.current?.focus();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
                {/* Back to Home */}
                <button
                    onClick={() => navigate("/")} // yoki window.location.href = "/"
                    className="absolute top-4 left-4 text-emerald-600 hover:underline text-sm"
                >
                    ← Back to Home
                </button>

                <h2 className="text-2xl font-semibold text-center text-emerald-700">Admin Login</h2>

                <input
                    type="text"
                    ref={userNameRef}
                    placeholder="Username"
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <input
                    type="password"
                    ref={passwordRef}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex justify-between gap-4">
                    <button
                        onClick={checkAdmin}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={clearInputs}
                        className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-2 px-4 rounded-md transition"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
