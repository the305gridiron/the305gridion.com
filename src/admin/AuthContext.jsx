import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    AUTH_EXPIRED_EVENT,
    clearToken,
    fetchCurrentUser,
    getToken,
    login as loginRequest,
} from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [status, setStatus] = useState("loading"); // loading | authenticated | anonymous

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setStatus("anonymous");
            return;
        }

        fetchCurrentUser(token)
            .then(() => setStatus("authenticated"))
            .catch(() => {
                clearToken();
                setStatus("anonymous");
            });
    }, []);

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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
