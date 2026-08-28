// Real writes to Xano — the counterpart to localStore.js's local-only
// layer. Nothing here runs automatically: every call is triggered by an
// explicit "Push to Xano" click in the admin panel.
//
// These endpoints now require a valid admin bearer token (see auth.js) —
// Xano rejects anything else with a 401/403.

import { AUTH_EXPIRED_EVENT, clearToken, getToken } from "./auth";

const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H";

// Confirmed limit on the current Xano plan: 10 requests / 20s. A "push all"
// run that ignored this fired 36 requests back-to-back and got the whole
// app (reads included) throttled. Every write below shares one rolling
// window, so a burst of up to 10 goes through immediately and anything past
// that waits just long enough to stay under the cap.
export const RATE_LIMIT_MAX = 10;
export const RATE_LIMIT_WINDOW_MS = 20_000;

const requestTimestamps = [];

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForRateLimitSlot() {
    for (;;) {
        const now = Date.now();
        while (
            requestTimestamps.length > 0 &&
            now - requestTimestamps[0] >= RATE_LIMIT_WINDOW_MS
        ) {
            requestTimestamps.shift();
        }

        if (requestTimestamps.length < RATE_LIMIT_MAX) {
            requestTimestamps.push(now);
            return;
        }

        // +50ms buffer so we land just after the window rolls, not exactly on it.
        const waitMs = RATE_LIMIT_WINDOW_MS - (now - requestTimestamps[0]) + 50;
        await sleep(Math.max(waitMs, 50));
    }
}

// Kept as a safety net, not the primary defense — waitForRateLimitSlot
// above should mean this almost never fires from our own traffic, but
// other load on the same Xano account (e.g. real site visitors) counts
// against the same cap and isn't something we can see coming.
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1500;

export class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = "RateLimitError";
    }
}

async function request(method, path, body) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        await waitForRateLimitSlot();

        const response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: {
                ...(body ? { "Content-Type": "application/json" } : {}),
                Authorization: `Bearer ${getToken() ?? ""}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (response.status === 401 || response.status === 403) {
            clearToken();
            window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
            throw new Error(
                `${method} ${path} failed (${response.status}): session expired, please log in again.`,
            );
        }

        if (response.status !== 429) {
            if (!response.ok) {
                const detail = await response.text().catch(() => "");
                throw new Error(
                    `${method} ${path} failed (${response.status})${detail ? `: ${detail}` : ""}`,
                );
            }
            return response.status === 204 ? null : response.json();
        }

        if (attempt === MAX_RETRIES) {
            throw new RateLimitError(
                `${method} ${path} was rate-limited by Xano after ${MAX_RETRIES} retries.`,
            );
        }

        const retryAfterSeconds = Number(response.headers.get("Retry-After"));
        const waitMs =
            Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
                ? retryAfterSeconds * 1000
                : BASE_BACKOFF_MS * 2 ** attempt;
        await sleep(waitMs);
    }

    // Unreachable — the loop above always returns or throws.
    return undefined;
}

// Creates a new record in Xano. Strips the local temp id — Xano assigns
// the real one — and returns the created record (with its real id).
export function pushCreate(entity, record) {
    const { id: _localId, ...body } = record;
    return request("POST", `/${entity}`, body);
}

// Patches only the given fields on an existing Xano record.
export function pushUpdate(entity, id, patch) {
    return request("PATCH", `/${entity}/${id}`, patch);
}

// Permanently deletes a record from Xano. Irreversible.
export function pushDelete(entity, id) {
    return request("DELETE", `/${entity}/${id}`);
}
