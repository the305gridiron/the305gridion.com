// Shared push-to-Xano logic used by both EntityAdminTable's toolbar and the
// depth chart's own push button, so a change made either way pushes exactly
// the same way (same rate-limit handling, same create-vs-update branching).
import { getLocalStatus, getOverrides, deleteRecord, clearOverride } from "./localStore";
import { pushCreate, pushUpdate, RateLimitError, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "./xanoWrite";

// Rough estimate for a "push all" confirm dialog — xanoWrite paces the
// actual requests against Xano's real 10-per-20s limit, this just gives the
// user a sense of how long that'll take before they commit to it.
export function estimatePushDurationSeconds(count) {
    const windows = Math.ceil(count / RATE_LIMIT_MAX);
    return Math.max(0, windows - 1) * (RATE_LIMIT_WINDOW_MS / 1000);
}

export async function pushOneRecord(entity, record) {
    const status = getLocalStatus(entity, record.id);
    if (!status) return;

    if (status === "created") {
        await pushCreate(entity, record);
        deleteRecord(entity, record.id);
    } else {
        const patch = getOverrides(entity)[record.id];
        await pushUpdate(entity, record.id, patch);
        clearOverride(entity, record.id);
    }
}

// Pushes each pending record in sequence — xanoWrite already paces
// individual requests against Xano's rate limit, this just stops the whole
// batch early if Xano starts rate-limiting anyway (e.g. other site traffic
// sharing the same cap).
export async function pushAllRecords(entity, pendingRecords, { onProgress } = {}) {
    const failures = [];
    let pushedCount = 0;
    let stoppedForRateLimit = false;

    for (const record of pendingRecords) {
        onProgress?.(record.id, true);
        try {
            await pushOneRecord(entity, record);
            pushedCount += 1;
        } catch (err) {
            if (err instanceof RateLimitError) {
                stoppedForRateLimit = true;
            } else {
                failures.push({ record, message: err.message });
            }
        } finally {
            onProgress?.(record.id, false);
        }

        if (stoppedForRateLimit) break;
    }

    return { pushedCount, failures, stoppedForRateLimit };
}
