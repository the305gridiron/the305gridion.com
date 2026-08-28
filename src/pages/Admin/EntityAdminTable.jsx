import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, UploadCloud, X, Check } from "lucide-react";
import {
    saveRecord,
    deleteRecord,
    getOverrides,
    clearOverride,
    restoreDeleted,
    getLocalStatus,
    isLocalId,
    mergeLocalData,
} from "@/admin/localStore";
import {
    pushCreate,
    pushUpdate,
    pushDelete,
    RateLimitError,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
} from "@/admin/xanoWrite";
import styles from "./Admin.module.css";

// Rough estimate for the "push all" confirm dialog — xanoWrite paces the
// actual requests against Xano's real 10-per-20s limit, this just gives the
// user a sense of how long that'll take before they commit to it.
function estimatePushDurationSeconds(count) {
    const windows = Math.ceil(count / RATE_LIMIT_MAX);
    return Math.max(0, windows - 1) * (RATE_LIMIT_WINDOW_MS / 1000);
}

function coerceValue(field, rawValue) {
    if (field.type === "checkbox") return !!rawValue;
    if (field.type === "number" || field.valueType === "number") {
        if (rawValue === "" || rawValue === null || rawValue === undefined) {
            return null;
        }
        const parsed = Number(rawValue);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return rawValue;
}

function optionValue(option) {
    return typeof option === "object" ? option.value : option;
}

function optionLabel(option) {
    return typeof option === "object" ? option.label : option;
}

function defaultValues(fields) {
    const values = {};
    fields.forEach((field) => {
        values[field.name] = field.type === "checkbox" ? false : "";
    });
    return values;
}

function FieldInput({ field, value, onChange }) {
    if (field.type === "select") {
        return (
            <select
                className={styles.formInput}
                value={value === null || value === undefined ? "" : String(value)}
                onChange={(e) => onChange(field.name, e.target.value)}
            >
                <option value=''>—</option>
                {field.options.map((option) => (
                    <option
                        key={optionValue(option)}
                        value={String(optionValue(option))}
                    >
                        {optionLabel(option)}
                    </option>
                ))}
            </select>
        );
    }

    if (field.type === "textarea") {
        return (
            <textarea
                className={styles.formTextarea}
                rows={field.rows || 3}
                value={value ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
            />
        );
    }

    return (
        <input
            className={styles.formInput}
            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
        />
    );
}

export default function EntityAdminTable({
    entity,
    label,
    sourceRecords,
    queryKey,
    listColumns,
    fields,
    getRowLabel,
    filterRecord,
}) {
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [pushingIds, setPushingIds] = useState(() => new Set());
    // Bumped after every local write so `records` recomputes — the
    // underlying source data doesn't change just because localStorage did.
    const [localVersion, setLocalVersion] = useState(0);

    const records = useMemo(() => {
        const merged = mergeLocalData(entity, sourceRecords);
        if (!filterRecord) return merged;

        // A record with a pending local edit/create always stays visible,
        // even if the edit itself is what would now make it fail the
        // filter (e.g. flipping a player's status to Inactive) — otherwise
        // the row vanishes the moment you save, and with it your only way
        // to review or push that change to Xano.
        return merged.filter(
            (record) => getLocalStatus(entity, record.id) || filterRecord(record),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps -- localVersion is the recompute trigger, not a real dependency
    }, [entity, sourceRecords, filterRecord, localVersion]);

    const pendingRecords = records.filter((record) =>
        getLocalStatus(entity, record.id),
    );

    const startEdit = (record) => {
        setEditingId(record.id);
        setFormValues(record);
    };

    const startCreate = () => {
        setEditingId("__new__");
        setFormValues(defaultValues(fields));
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormValues({});
    };

    const handleFieldChange = (name, rawValue) => {
        setFormValues((prev) => ({ ...prev, [name]: rawValue }));
    };

    const handleSave = () => {
        const coerced = {};
        fields.forEach((field) => {
            coerced[field.name] = coerceValue(field, formValues[field.name]);
        });

        const payload =
            editingId === "__new__"
                ? coerced
                : { ...coerced, id: editingId };

        saveRecord(entity, payload);
        setLocalVersion((v) => v + 1);
        cancelEdit();
    };

    const handleDelete = async (id) => {
        const target = records.find((record) => record.id === id);
        const name = target ? getRowLabel(target) : id;
        if (!window.confirm(`Remove "${name}" from the local ${label} data?`)) {
            return;
        }
        deleteRecord(entity, id);
        setLocalVersion((v) => v + 1);
        if (editingId === id) cancelEdit();

        if (isLocalId(id)) return;

        const alsoDeleteInXano = window.confirm(
            `Also permanently delete "${name}" from Xano right now? This cannot be undone.`,
        );
        if (!alsoDeleteInXano) return;

        try {
            await pushDelete(entity, id);
            restoreDeleted(entity, id);
            setLocalVersion((v) => v + 1);
            queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            const reason =
                err instanceof RateLimitError
                    ? "Xano is rate-limiting requests right now — wait a bit before trying again."
                    : err.message;
            window.alert(
                `Couldn't delete "${name}" from Xano: ${reason}\nIt's still hidden locally — try again later.`,
            );
        }
    };

    const pushOne = async (record) => {
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
    };

    const handlePush = async (record) => {
        setPushingIds((prev) => new Set(prev).add(record.id));
        try {
            await pushOne(record);
            setLocalVersion((v) => v + 1);
            queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            const reason =
                err instanceof RateLimitError
                    ? "Xano is rate-limiting requests right now — wait a bit before trying again."
                    : err.message;
            window.alert(`Couldn't push "${getRowLabel(record)}" to Xano: ${reason}`);
        } finally {
            setPushingIds((prev) => {
                const next = new Set(prev);
                next.delete(record.id);
                return next;
            });
        }
    };

    const handlePushAll = async () => {
        if (pendingRecords.length === 0) return;
        const estimateSeconds = estimatePushDurationSeconds(pendingRecords.length);
        const estimateNote =
            estimateSeconds > 0
                ? ` Xano allows ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW_MS / 1000}s on this plan, so this will take at least ~${estimateSeconds}s.`
                : "";
        if (
            !window.confirm(
                `Push ${pendingRecords.length} local change${pendingRecords.length === 1 ? "" : "s"} to Xano now?${estimateNote}`,
            )
        ) {
            return;
        }

        const failures = [];
        let pushedCount = 0;
        let stoppedForRateLimit = false;

        for (const record of pendingRecords) {
            setPushingIds((prev) => new Set(prev).add(record.id));
            try {
                await pushOne(record);
                pushedCount += 1;
            } catch (err) {
                if (err instanceof RateLimitError) {
                    stoppedForRateLimit = true;
                } else {
                    failures.push(`${getRowLabel(record)}: ${err.message}`);
                }
            } finally {
                setPushingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(record.id);
                    return next;
                });
            }

            if (stoppedForRateLimit) break;
        }

        setLocalVersion((v) => v + 1);
        queryClient.invalidateQueries({ queryKey });

        if (stoppedForRateLimit) {
            const remaining = pendingRecords.length - pushedCount - failures.length;
            window.alert(
                `Stopped after Xano started rate-limiting requests. Pushed ${pushedCount}/${pendingRecords.length} — ${remaining} left to try. Wait a minute or two, then click "Push to Xano" again to pick up where this left off.`,
            );
        } else if (failures.length > 0) {
            window.alert(
                `Pushed ${pushedCount}/${pendingRecords.length}. Failed:\n${failures.join("\n")}`,
            );
        }
    };

    return (
        <div className={styles.tableWrap}>
            <div className={styles.tableToolbar}>
                <span className={styles.tableCount}>
                    {records.length} {label.toLowerCase()}
                    {pendingRecords.length > 0 &&
                        ` · ${pendingRecords.length} pending push`}
                </span>
                <div className={styles.toolbarActions}>
                    {pendingRecords.length > 0 && (
                        <button
                            className={styles.pushAllBtn}
                            onClick={handlePushAll}
                            disabled={pushingIds.size > 0}
                        >
                            <UploadCloud size={14} /> Push {pendingRecords.length}{" "}
                            to Xano
                        </button>
                    )}
                    <button className={styles.addBtn} onClick={startCreate}>
                        <Plus size={14} /> Add {label.slice(0, -1)}
                    </button>
                </div>
            </div>

            <table className={styles.adminTable}>
                <thead>
                    <tr>
                        <th className={styles.statusCol}></th>
                        {listColumns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                        <th className={styles.actionsCol}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {editingId === "__new__" && (
                        <EditRow
                            fields={fields}
                            formValues={formValues}
                            onChange={handleFieldChange}
                            onSave={handleSave}
                            onCancel={cancelEdit}
                            colSpan={listColumns.length + 2}
                        />
                    )}

                    {records.length === 0 && editingId !== "__new__" && (
                        <tr>
                            <td
                                colSpan={listColumns.length + 2}
                                className={styles.emptyState}
                            >
                                No {label.toLowerCase()} yet.
                            </td>
                        </tr>
                    )}

                    {records.map((record) => {
                        const localStatus = getLocalStatus(entity, record.id);

                        if (editingId === record.id) {
                            return (
                                <EditRow
                                    key={record.id}
                                    fields={fields}
                                    formValues={formValues}
                                    onChange={handleFieldChange}
                                    onSave={handleSave}
                                    onCancel={cancelEdit}
                                    colSpan={listColumns.length + 2}
                                />
                            );
                        }

                        return (
                            <tr key={record.id}>
                                <td className={styles.statusCol}>
                                    {localStatus && (
                                        <span
                                            className={`${styles.localDot} ${
                                                localStatus === "created"
                                                    ? styles.localDotCreated
                                                    : styles.localDotEdited
                                            }`}
                                            title={
                                                localStatus === "created"
                                                    ? "Only exists locally — not in Xano yet"
                                                    : "Edited locally — Xano still has the original"
                                            }
                                        />
                                    )}
                                </td>
                                {listColumns.map((col) => (
                                    <td key={col.key}>
                                        {col.render
                                            ? col.render(record)
                                            : String(record[col.key] ?? "-")}
                                    </td>
                                ))}
                                <td className={styles.actionsCol}>
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => startEdit(record)}
                                        aria-label='Edit'
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    {localStatus && (
                                        <button
                                            className={styles.iconBtn}
                                            onClick={() => handlePush(record)}
                                            disabled={pushingIds.has(record.id)}
                                            aria-label='Push to Xano'
                                            title='Push this change to Xano'
                                        >
                                            <UploadCloud size={14} />
                                        </button>
                                    )}
                                    <button
                                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                                        onClick={() => handleDelete(record.id)}
                                        aria-label='Delete'
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function EditRow({ fields, formValues, onChange, onSave, onCancel, colSpan }) {
    return (
        <tr className={styles.editRow}>
            <td colSpan={colSpan}>
                <div className={styles.editForm}>
                    {fields.map((field) => {
                        if (field.type === "checkbox") {
                            return (
                                <label
                                    key={field.name}
                                    className={styles.formCheckboxField}
                                >
                                    <input
                                        type='checkbox'
                                        checked={!!formValues[field.name]}
                                        onChange={(e) =>
                                            onChange(
                                                field.name,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span>{field.label}</span>
                                    {field.hint && (
                                        <span className={styles.formHint}>
                                            {field.hint}
                                        </span>
                                    )}
                                </label>
                            );
                        }

                        return (
                            <label
                                key={field.name}
                                className={
                                    field.wide
                                        ? styles.formFieldWide
                                        : styles.formField
                                }
                            >
                                <span className={styles.formLabel}>
                                    {field.label}
                                </span>
                                <FieldInput
                                    field={field}
                                    value={formValues[field.name]}
                                    onChange={onChange}
                                />
                                {field.hint && (
                                    <span className={styles.formHint}>
                                        {field.hint}
                                    </span>
                                )}
                            </label>
                        );
                    })}

                    <div className={styles.editFormActions}>
                        <button
                            className={styles.saveBtn}
                            onClick={onSave}
                        >
                            <Check size={14} /> Save
                        </button>
                        <button className={styles.cancelBtn} onClick={onCancel}>
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
