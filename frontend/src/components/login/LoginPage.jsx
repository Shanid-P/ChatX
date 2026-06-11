import React, { useState, useEffect } from 'react';
import SignupPopup from './SignupPopup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ForgotPasswordPopup from './ForgotPasswordPopup.jsx';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import { validatePassword, validateEmail, validateName } from "./validateLogin.js";

library.add(fas);

// Fallback configuration if not provided elsewhere globally
// const API_URL = window.API_URL || "http://127.0.0.1:8000";

// function validateUserData(email, password) {
//     if (validateEmail(email) != null) {
//         toast.error(validateEmail(email));
//         return false;
//     }
//     if (!password) {
//         toast.error("Password is required");
//         return false;
//     }
//     return true;
// }

const Input = ({ type, placeholder, icon, value, onChange, showPassword, setShowPassword }) => {
    return (
        /* Replaced --violet with --color-accent and --secondary-bg with --color-surface-hover */
        <div className="flex items-center border w-full focus-within:border-[var(--color-accent)] transition duration-300 pr-3 gap-2 bg-[var(--color-surface-hover)] border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
            <FontAwesomeIcon icon={icon} className="text-gray-500 text-xl ml-3" />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full h-full pl-1 outline-none placeholder-gray-500 text-sm bg-transparent text-[var(--color-primary)]"
            />

            {(type === "password" || type === "text") && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                >
                    <FontAwesomeIcon
                        icon={showPassword ? "eye" : "eye-slash"}
                        className="text-gray-500 text-xl mr-2"
                    />
                </button>
            )}
        </div>
    );
};

// Destructured onLoginSuccess directly to prevent runtime reference crashes
const LoginPage = ({ onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showSignup, setShowSignup] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateUserData(email, password)) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password,
                    // name: 'user'
                })
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.ok) {
                toast.success("Login successful");
                // if (onLoginSuccess) onLoginSuccess(data.role);
                localStorage.setItem("token", data.token);
                navigate("/chats");
            } else {
                toast.error(data.detail || "Login failed");
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("Server error. Please try again.");
        }
    };

    return (
        /* Replaced background with --color-canvas */
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-canvas)] p-4 font-sans relative overflow-hidden">
            {/* Popups */}
            {showSignup && <SignupPopup onClose={() => setShowSignup(false)} />}
            {showForgot && <ForgotPasswordPopup onClose={() => setShowForgot(false)} />}

            {/* Main Content with Blur effect */}
            <div className={`flex justify-center items-center transition-all duration-300 ${showSignup || showForgot ? 'blur-md' : 'blur-0'} w-full max-w-[95%] sm:max-w-none`}>
                {/* Changed base text color to utilize theme --color-primary structural slate color */}
                <div className="login-area text-[var(--color-primary)] text-center w-full max-w-lg">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold p-4">
                        Login to <span className='text-[var(--color-accent)]'>Chat</span>X
                    </h1>
                    {/* Changed sub-text color to match theme layout style --color-secondary */}
                    <h3 className='text-lg sm:text-xl text-[var(--color-secondary)] mb-3 px-4'>
                        Access your messenger app
                    </h3>

                    <form onSubmit={handleSubmit} noValidate className='w-full px-4 sm:px-0'>
                        {/* Swapped container panels to deploy floating card spec --color-surface layout */}
                        <div className="inputs-section bg-[var(--color-surface)] border border-[var(--color-border)] py-8 sm:py-10 px-6 sm:px-12 rounded-2xl mt-8 shadow-sm">
                            <div className="group-container">
                                <div className="div-group mb-6">
                                    <Input
                                        type="email"
                                        placeholder="Username"
                                        icon="at"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="div-group mb-6">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        icon='lock'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword}
                                    />
                                </div>
                            </div>
                            
                            {/* Upgraded Submit Button to execute --color-accent and --color-accent-hover workflow */}
                            <button 
                                type="submit" 
                                className="bg-[var(--color-accent)] text-white cursor-pointer py-2.5 px-6 block w-full rounded-[5px] mb-4 font-semibold transition duration-200 hover:bg-[var(--color-accent-hover)] shadow-sm"
                            >
                                Login
                            </button>

                            <button 
                                type="button"
                                onClick={() => setShowForgot(true)}
                                className='text-[var(--color-accent)] text-[15px] block mx-auto hover:underline cursor-pointer bg-transparent border-none'
                            >
                                Forgot Password
                            </button>
                            
                            <p className='text-[15px] text-[var(--color-secondary)] mt-4'>
                                Don't have an account?{' '}
                                <button 
                                    type="button" 
                                    onClick={() => setShowSignup(true)} 
                                    className='text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none'
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;