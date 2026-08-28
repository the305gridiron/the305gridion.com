// Xano Auth for the admin panel. Separate API group from the data/write
// group in xanoWrite.js — Xano scaffolds auth endpoints into their own group
// when you enable Authentication on a table.
const AUTH_BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:MguiAuHX";

const TOKEN_KEY = "the305_admin_token";

// Fired when a write call comes back 401/403 (expired/invalid token) so
// AuthContext can drop back to the anonymous state without every caller
// needing to know about auth.
export const AUTH_EXPIRED_EVENT = "admin-auth:expired";

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function login(email, password) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error(
            [401, 403, 404].includes(response.status)
                ? "Incorrect email or password."
                : `Login failed (${response.status}).`,
        );
    }

    const data = await response.json();
    sessionStorage.setItem(TOKEN_KEY, data.authToken);
    return data.authToken;
}

// Doubles as a token-validity check on app load — Xano rejects an
// expired/invalid token here with a 401.
export async function fetchCurrentUser(token) {
    const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw new Error("Session expired.");
    }

    return response.json();
}
