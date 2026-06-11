import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// Connect solid icons for structural markup compatibility
library.add(fas);

const Input = ({ type, placeholder, icon, value, onChange, showPassword, setShowPassword }) => {
    return (
        /* Replaced background and focus-ring states with structural theme values */
        <div className="flex items-center border w-full focus-within:border-[var(--color-accent)] transition duration-300 pr-3 gap-2 bg-[var(--color-surface-hover)] border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
            <FontAwesomeIcon icon={['fas', icon]} className="text-gray-500 text-xl ml-3" />
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

function ForgotPasswordPopup({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // OTP input controller logic
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus propagation lookup framework
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    console.log("OTP Submit Value:", finalOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop animation handler */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Main Popup Modal (Mapped directly onto --color-surface and --color-border layout panels) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 shadow-2xl z-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none"
        >
          <FontAwesomeIcon icon={['fas', 'times']} />
        </button>

        <AnimatePresence mode="wait">
          {/* Step 1: Email Request Entry Module */}
          {step === 1 && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                Forgot Password
              </h2>
              <p className="text-sm text-[var(--color-secondary)] mb-6">
                Enter your email to receive OTP
              </p>

              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="at"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--color-accent)] text-white font-semibold rounded-lg transition duration-200 hover:bg-[var(--color-accent-hover)] cursor-pointer shadow-sm"
                >
                  Send OTP
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Verification Input Framework Module */}
          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                Verify OTP
              </h2>
              <p className="text-sm text-[var(--color-secondary)] mb-6">
                Enter the 6-digit code sent to your email
              </p>

              <form onSubmit={handleVerifyOtp}>
                {/* Fixed layout flex metrics styling conflict */}
                <div className="flex justify-between gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      className="w-12 h-12 text-center text-lg font-semibold border focus:border-[var(--color-accent)] outline-none transition duration-200 bg-[var(--color-surface-hover)] border-gray-500/30 rounded-[5px] text-[var(--color-primary)]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--color-success)] text-white font-semibold rounded-lg transition duration-200 hover:opacity-90 cursor-pointer shadow-sm"
                >
                  Verify OTP
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="block text-xs text-center text-[var(--color-secondary)] mx-auto mt-4 cursor-pointer hover:underline bg-transparent border-none"
                >
                  Change Email
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPopup;