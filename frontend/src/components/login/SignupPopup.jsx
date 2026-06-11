import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { validatePassword, validateEmail, validateName } from "./validateLogin.js";

// Ensure Solid icons are loaded for user, at, lock, key, and times
library.add(fas);

// Fallback configuration for the API base URL
// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://chatx-r9e0.onrender.com' || 'http://127.0.0.1:8000';

function validateUserData(name, email, password){
    if(validateName(name) != null){
        toast.error(validateName(name));
        return false;
    }
    if(validateEmail(email) != null){
        toast.error(validateEmail(email));
        return false;
    }
    if(validatePassword(password) != null){
        toast.error(validatePassword(password));
        return false;
    }
    return true;
}

const Input = ({ type, placeholder, icon, value, onChange, isPasswordField, showPassword, setShowPassword }) => {
  return (
    /* Integrated --color-accent focus ring & --color-surface-hover background */
    <div className="flex items-center border w-full focus-within:border-[var(--color-accent)] transition duration-300 pr-3 gap-2 bg-[var(--color-surface-hover)] border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
      <FontAwesomeIcon icon={['fas', icon]} className="text-gray-500 text-xl ml-3" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full pl-1 outline-none placeholder-gray-500 text-sm bg-transparent text-[var(--color-primary)]"
      />

      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer bg-transparent border-none"
        >
          <FontAwesomeIcon
            icon={['fas', showPassword ? "eye" : "eye-slash"]}
            className="text-gray-500 text-xl mr-2"
          />
        </button>
      )}
    </div>
  );
};

const SignupPopup = ({ onClose }) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if(!validateUserData(name, email, password)) return;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    // name: name,
                    password: password,
                })
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.ok) {
                toast.success("Signup successful!");
                onClose();
            } else {
                toast.error(data.detail || "SignUp failed");
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("Server error. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            ></div>

            {/* Popup Container Panel (Mapped to theme surface configuration) */}
            <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] w-full max-w-md rounded-2xl shadow-2xl p-8 z-10">

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
                >
                    <FontAwesomeIcon icon={['fas', 'times']} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                        Create Account
                    </h2>
                    <p className="text-[var(--color-secondary)]">
                        Enjoy your chattings
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Name */}
                    {/* <div className="div-group mb-4">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon="user"
                        />
                    </div> */}

                    {/* Email */}
                    <div className="div-group mb-4">
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            icon="at"
                        />
                    </div>

                    {/* Password */}
                    <div className="div-group mb-4">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon="lock"
                            isPasswordField={true}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="div-group mb-6">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon="key"
                            isPasswordField={true}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    </div>

                    {/* Action Submit Button (Uses --color-accent and hover states) */}
                    <button
                        type="submit"
                        className="bg-[var(--color-accent)] text-white py-2.5 px-6 w-full rounded font-semibold cursor-pointer transition duration-200 hover:bg-[var(--color-accent-hover)] shadow-sm"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--color-secondary)]">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--color-accent)] font-semibold hover:underline cursor-pointer bg-transparent border-none"
                    >
                        Log In
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SignupPopup;