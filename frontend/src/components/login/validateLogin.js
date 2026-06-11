export function validateEmail(email) {
    if (!email) {
        return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    return null;
}

export function validatePassword(password) {
    if(!password) return "Password is required";
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain a lowercase letter";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain an uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain a number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Password must contain a special character";
    }

    return null;
}
export function validateName(name) {
    if (!name) {
        return "Name is required";
    }

    if (name.length < 3) {
        return "Name must be at least 3 characters";
    }

    return null;
}

