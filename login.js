import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
    getAuth,
    fetchSignInMethodsForEmail,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import { encryptName, encryptPassword, encryptEmail } from "./encrypt.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBncDHlbS6Fkgevrs2FmfrmJ-DjRaF2keM",
    authDomain: "csfinalproject-70670.firebaseapp.com",
    projectId: "csfinalproject-70670",
    storageBucket: "csfinalproject-70670.firebasestorage.app",
    messagingSenderId: "924015256737",
    appId: "1:924015256737:web:52b80d9e5186362d5f7ce0",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Email validation functions
function isValidEmailFormat(email) {
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailCheck.test(email);
}

async function checkEmailDomain(email) {
    const domain = email.split("@")[1];
    try {
        const response = await fetch(
            `https://dns.google/resolve?name=${domain}&type=MX`,
        );
        const data = await response.json();
        return data.Answer && data.Answer.length > 0;
    } catch (error) {
        console.error("Error checking domain:", error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Password toggle functionality
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            const targetId = toggle.getAttribute("data-for");
            const passwordInput = document.getElementById(targetId);
            const icon = toggle.querySelector("i");

            // Toggle password visibility
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            // Toggle icon and add animation
            toggle.classList.add("animate");
            setTimeout(() => {
                icon.classList.toggle("fa-eye");
                icon.classList.toggle("fa-eye-slash");
                toggle.classList.remove("animate");
            }, 150);
        });
    });
    const themeToggle = document.getElementById("themeToggle");
    //const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    } else {
        // Default to light mode
        document.body.classList.remove("dark-mode");
        themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const toggleContainer = document.querySelector(".toggle-container");
    const signupEmail = document.getElementById("signupEmail");

    // Check if email exists when user types in signup email
    signupEmail.addEventListener("blur", async () => {
        const email = signupEmail.value;
        if (!email) return;

        // Check email format
        if (!isValidEmailFormat(email)) {
            alert("Please enter a valid email address");
            signupEmail.value = "";
            signupEmail.focus();
            return;
        }

        // Check if domain exists
        const domainExists = await checkEmailDomain(email);
        if (!domainExists) {
            alert(
                "This email domain does not exist. Please enter a valid email address.",
            );
            signupEmail.value = "";
            signupEmail.focus();
            return;
        }

        // Check if email is already registered
        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                alert(
                    "This email is already registered. Please use a different email or login instead.",
                );
                signupEmail.value = "";
                signupEmail.focus();
            }
        } catch (error) {
            console.error("Error checking email:", error);
        }
    });

    // Toggle between login and signup forms
    loginBtn.addEventListener("click", () => {
        if (loginBtn.classList.contains("active")) return;

        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
        toggleContainer.setAttribute("data-active", "login");

        // Trigger the transition
        signupForm.classList.remove("active");
        setTimeout(() => {
            loginForm.classList.add("active");
        }, 50);
    });

    signupBtn.addEventListener("click", () => {
        if (signupBtn.classList.contains("active")) return;

        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
        toggleContainer.setAttribute("data-active", "signup");

        loginForm.classList.remove("active");
        setTimeout(() => {
            signupForm.classList.add("active");
        }, 50);
    });

    // Handle login form subm`mission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        let encryptedEmail = encryptEmail(email);
        let encryptedPassword = encryptPassword(password);

        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        function handleSignIn(email, password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                    localStorage.setItem("uid", user.uid);
                    window.location.href = "dashboard.html";
                })
                .catch((error) => {
                    // Handle errors here
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error("Error signing in:", errorCode, errorMessage);
                    alert("Unable to login.  Error: " + errorMessage);
                });
        }

        handleSignIn(email, password);
        console.log("Login attempt:", { email, password });
    });

    // Handle signup form submission
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!isValidEmailFormat(email)) {
            alert("Please enter a valid email address");
            return;
        }

        const domainExists = await checkEmailDomain(email);
        if (!domainExists) {
            alert(
                "This email domain does not exist. Please enter a valid email address.",
            );
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 12) {
            alert("Password must be at least 12 characters long");
            return;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            alert("Password must have at least one special character");
            return;
        }

        if (!hasUpperAndLowerCase(password)) {
            alert(
                "Password must have at least one uppercase and one lowercase letter",
            );
            return;
        }

        if (!/\d/.test(password)) {
            alert("Password must have at least one number");
            return;
        }

        // Check if email exists
        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                alert(
                    "This email is already registered. Please use a different email or login instead.",
                );
                return;
            }
        } catch (error) {
            console.error("Error checking email:", error);
            alert(
                "An error occurred while checking the email. Please try again.",
            );
            return;
        }

        async function handleSignUp(email, password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );
                const user = userCredential.user;
                localStorage.setItem("uid", user.uid);
                console.log("User signed up:", user);

                const encryptedName = await encryptName(name);
                const encryptedEmail = await encryptEmail(email);
                const encryptedPassword = await encryptPassword(password);

                const reference = ref(db, "users/" + user.uid + "/");
                await set(reference, {
                    name: encryptedName,
                    email: encryptedEmail,
                    password: encryptedPassword,
                });

                console.log("Data written successfully.");
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Error signing up:", error.code, error.message);
                alert(
                    "Error signing up. Please try again. Error: " +
                        error.message,
                );
            }
        }

        function hasUpperAndLowerCase(str) {
            let hasUpper = false;
            let hasLower = false;

            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                if (char >= "a" && char <= "z") {
                    hasLower = true;
                } else if (char >= "A" && char <= "Z") {
                    hasUpper = true;
                }

                if (hasUpper && hasLower) {
                    return true;
                }
            }
            return false;
        }

        try {
            handleSignUp(email, password);

            document.getElementById("signupName").value = "";
            document.getElementById("signupEmail").value = "";
            document.getElementById("signupPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        } catch (error) {
            console.error("Error during encryption/decryption:", error);
            alert(
                "An error occurred during the signup process. Please try again.",
            );
        }
    });
});
