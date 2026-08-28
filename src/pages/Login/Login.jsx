import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageTitle } from "@/components/layout";
import { useAuth } from "@/admin/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const destination = location.state?.from?.pathname || "/admin";

    useEffect(() => {
        if (isAuthenticated) {
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, destination, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate(destination, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageTitle title='Admin Login - The 305 Gridiron' />
            <div className={styles.loginContainer}>
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Admin Login</h1>

                    {error && <p className={styles.error}>{error}</p>}

                    <label className={styles.field}>
                        <span>Email</span>
                        <input
                            type='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete='username'
                            required
                        />
                    </label>

                    <label className={styles.field}>
                        <span>Password</span>
                        <input
                            type='password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete='current-password'
                            required
                        />
                    </label>

                    <button type='submit' className={styles.submitBtn} disabled={submitting}>
                        {submitting ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </div>
        </>
    );
}
