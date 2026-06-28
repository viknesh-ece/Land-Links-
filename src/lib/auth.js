"use client";
export function getLoggedInUser() {
    if (typeof window === "undefined")
        return null;
    try {
        const data = localStorage.getItem("landlinkx_user");
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error("Error reading auth session:", error);
        return null;
    }
}
export function loginUser(user) {
    if (typeof window === "undefined")
        return;
    try {
        localStorage.setItem("landlinkx_user", JSON.stringify(user));
        // Dispatch a custom event to notify other components (like Navbar) of auth state changes
        window.dispatchEvent(new Event("auth-change"));
    }
    catch (error) {
        console.error("Error writing auth session:", error);
    }
}
export function logoutUser() {
    if (typeof window === "undefined")
        return;
    try {
        localStorage.removeItem("landlinkx_user");
        window.dispatchEvent(new Event("auth-change"));
    }
    catch (error) {
        console.error("Error removing auth session:", error);
    }
}
