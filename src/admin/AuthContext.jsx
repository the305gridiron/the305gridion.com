import { useCallback, useEffect, useState } from "react";
import {
    AUTH_EXPIRED_EVENT,
    clearToken,
    fetchCurrentUser,
    getToken,
    login as loginRequest,
} from "./auth";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
    // No token means there's nothing to verify — skip straight to
    // anonymous instead of doing that check as a side effect after mount.
    const [status, setStatus] = useState(() => (getToken() ? "loading" : "anonymous"));

    useEffect(() => {
        if (status !== "loading") return;

        fetchCurrentUser(getToken())
            .then(() => setStatus("authenticated"))
            .catch(() => {
                clearToken();
                setStatus("anonymous");
            });
    }, [status]);

    useEffect(() => {
        const handleExpired = () => setStatus("anonymous");
        window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    }, []);

    const login = useCallback(async (email, password) => {
        await loginRequest(email, password);
        setStatus("authenticated");
    }, []);

    const logout = useCallback(() => {
        clearToken();
        setStatus("anonymous");
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: status === "authenticated",
                isLoading: status === "loading",
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
