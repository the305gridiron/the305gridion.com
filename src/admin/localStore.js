// Local-only data layer for the dev admin panel. Nothing here ever talks to
// Xano — it just layers overrides/creations/deletions on top of whatever the
// live API returns, persisted in localStorage so edits survive a refresh.
// Meant as a stopgap until there's time to wire real writes into Xano.

const storageKey = (entity, bucket) => `admin:${entity}:${bucket}`;

function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getOverrides(entity) {
    return readJSON(storageKey(entity, "overrides"), {});
}

export function getCreated(entity) {
    return readJSON(storageKey(entity, "created"), []);
}

export function getDeleted(entity) {
    return readJSON(storageKey(entity, "deleted"), []);
}

export function isLocalId(id) {
    return typeof id === "string" && id.startsWith("local-");
}

function makeLocalId() {
    return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Merges a locally-created or overridden record with what's already in the
// bucket, applies it, and returns the id it was saved under.
export function saveRecord(entity, record) {
    if (record.id && isLocalId(record.id)) {
        const created = getCreated(entity).map((r) =>
            r.id === record.id ? { ...r, ...record } : r,
        );
        writeJSON(storageKey(entity, "created"), created);
        return record.id;
    }

    if (record.id !== undefined && record.id !== null) {
        const overrides = getOverrides(entity);
        overrides[record.id] = { ...overrides[record.id], ...record };
        writeJSON(storageKey(entity, "overrides"), overrides);
        return record.id;
    }

    const id = makeLocalId();
    const created = getCreated(entity);
    created.push({ ...record, id });
    writeJSON(storageKey(entity, "created"), created);
    return id;
}

export function deleteRecord(entity, id) {
    if (isLocalId(id)) {
        const created = getCreated(entity).filter((r) => r.id !== id);
        writeJSON(storageKey(entity, "created"), created);
        return;
    }

    const overrides = getOverrides(entity);
    delete overrides[id];
    writeJSON(storageKey(entity, "overrides"), overrides);

    const deleted = getDeleted(entity);
    if (!deleted.includes(id)) {
        deleted.push(id);
        writeJSON(storageKey(entity, "deleted"), deleted);
    }
}

export function clearOverride(entity, id) {
    const overrides = getOverrides(entity);
    delete overrides[id];
    writeJSON(storageKey(entity, "overrides"), overrides);
}

export function restoreDeleted(entity, id) {
    const deleted = getDeleted(entity).filter((d) => d !== id);
    writeJSON(storageKey(entity, "deleted"), deleted);
}

export function clearAllLocalData(entity) {
    writeJSON(storageKey(entity, "overrides"), {});
    writeJSON(storageKey(entity, "created"), []);
    writeJSON(storageKey(entity, "deleted"), []);
}

// Applies overrides/creations/deletions on top of the live source records.
// Used both by the admin panel (to build its working table) and by the
// public query hooks (so edits show up on the real pages immediately).
export function mergeLocalData(entity, sourceRecords = []) {
    const overrides = getOverrides(entity);
    const created = getCreated(entity);
    const deleted = new Set(getDeleted(entity));

    const merged = sourceRecords
        .filter((record) => !deleted.has(record.id))
        .map((record) =>
            overrides[record.id]
                ? { ...record, ...overrides[record.id] }
                : record,
        );

    return [...merged, ...created];
}

// True when a record (already merged) differs from what Xano would return —
// i.e. it's locally created or has a pending override — so the admin table
// can flag it as "not yet in Xano".
export function getLocalStatus(entity, id) {
    if (isLocalId(id)) return "created";
    if (getOverrides(entity)[id]) return "edited";
    return null;
}
