import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, UploadCloud, X, Check } from "lucide-react";
import {
    saveRecord,
    deleteRecord,
    restoreDeleted,
    getLocalStatus,
    isLocalId,
    mergeLocalData,
} from "@/admin/localStore";
import { pushDelete, RateLimitError, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/admin/xanoWrite";
import { pushAllRecords, estimatePushDurationSeconds } from "@/admin/pushPending";
import { uploadImageToCloudinary } from "@/admin/cloudinaryUpload";
import styles from "./Admin.module.css";

function coerceValue(field, rawValue) {
    if (field.type === "checkbox") return !!rawValue;
    if (field.type === "number" || field.valueType === "number") {
        if (rawValue === "" || rawValue === null || rawValue === undefined) {
            return null;
        }
        const parsed = Number(rawValue);
        return Number.isNaN(parsed) ? null : parsed;
    }
    if (field.type === "datetime") {
        if (!rawValue) return null;
        const ms = new Date(rawValue).getTime();
        return Number.isNaN(ms) ? null : ms;
    }
    return rawValue;
}

// Renders a raw epoch-ms value (or an already-edited datetime-local string)
// as the "YYYY-MM-DDTHH:mm" format <input type="datetime-local"> expects,
// in the browser's own local time zone — matching how the site itself
// already displays these timestamps (toLocaleTimeString on read).
function toDateTimeLocalValue(value) {
    if (value === null || value === undefined || value === "") return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return typeof value === "string" ? value : "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
        if (field.type === "custom") return;
        values[field.name] = field.type === "checkbox" ? false : "";
    });
    return values;
}

// Text input for the URL (paste an existing Cloudinary link directly) plus
// an upload button that pushes a chosen file straight to Cloudinary and
// fills the URL in for you. Either path just ends up setting a plain string,
// same as a text field — no special save-time handling needed.
function ImageField({ field, value, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const url = await uploadImageToCloudinary(file);
            onChange(field.name, url);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.imageField}>
            {value && <img src={value} alt='' className={styles.imagePreview} />}
            <input
                className={styles.formInput}
                type='text'
                placeholder='Image URL'
                value={value ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
            />
            <label className={styles.uploadBtn}>
                {uploading ? "Uploading…" : "Upload image"}
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleFile}
                    disabled={uploading}
                    hidden
                />
            </label>
            {error && <span className={styles.uploadError}>{error}</span>}
        </div>
    );
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

    if (field.type === "datetime") {
        return (
            <input
                className={styles.formInput}
                type='datetime-local'
                value={toDateTimeLocalValue(value)}
                onChange={(e) => onChange(field.name, e.target.value)}
            />
        );
    }

    if (field.type === "image") {
        return <ImageField field={field} value={value} onChange={onChange} />;
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
    getRowStyle,
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
            if (field.type === "custom") return;
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
            await queryClient.invalidateQueries({ queryKey });
            setLocalVersion((v) => v + 1);
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

    const handlePush = async (record) => {
        setPushingIds((prev) => new Set(prev).add(record.id));
        try {
            const { failures, stoppedForRateLimit } = await pushAllRecords(entity, [record]);
            // Wait for the refetch before re-rendering — otherwise the merge
            // runs against the pre-push cached data with the override
            // already cleared, which flashes/looks like the edit reverted.
            await queryClient.invalidateQueries({ queryKey });
            setLocalVersion((v) => v + 1);
            if (stoppedForRateLimit) {
                window.alert(
                    `Couldn't push "${getRowLabel(record)}" to Xano: Xano is rate-limiting requests right now — wait a bit before trying again.`,
                );
            } else if (failures.length > 0) {
                window.alert(`Couldn't push "${getRowLabel(record)}" to Xano: ${failures[0].message}`);
            }
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

        const { pushedCount, failures, stoppedForRateLimit } = await pushAllRecords(
            entity,
            pendingRecords,
            {
                onProgress: (id, active) =>
                    setPushingIds((prev) => {
                        const next = new Set(prev);
                        if (active) next.add(id);
                        else next.delete(id);
                        return next;
                    }),
            },
        );

        await queryClient.invalidateQueries({ queryKey });
        setLocalVersion((v) => v + 1);

        if (stoppedForRateLimit) {
            const remaining = pendingRecords.length - pushedCount - failures.length;
            window.alert(
                `Stopped after Xano started rate-limiting requests. Pushed ${pushedCount}/${pendingRecords.length} — ${remaining} left to try. Wait a minute or two, then click "Push to Xano" again to pick up where this left off.`,
            );
        } else if (failures.length > 0) {
            window.alert(
                `Pushed ${pushedCount}/${pendingRecords.length}. Failed:\n${failures
                    .map((f) => `${getRowLabel(f.record)}: ${f.message}`)
                    .join("\n")}`,
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
                            <th
                                key={col.key}
                                style={col.align ? { textAlign: col.align } : undefined}
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className={styles.actionsCol}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 && (
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

                        return (
                            <tr key={record.id} style={getRowStyle?.(record)}>
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
                                    <td
                                        key={col.key}
                                        style={col.align ? { textAlign: col.align } : undefined}
                                    >
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

            {editingId !== null && (
                <EditModal
                    label={label}
                    fields={fields}
                    formValues={formValues}
                    onChange={handleFieldChange}
                    onSave={handleSave}
                    onCancel={cancelEdit}
                    recordId={editingId === "__new__" ? null : editingId}
                    isNew={editingId === "__new__"}
                />
            )}
        </div>
    );
}

function EditModal({ label, fields, formValues, onChange, onSave, onCancel, recordId, isNew }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    return (
        <div className={styles.modalBackdrop} onClick={onCancel}>
            <div className={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        {isNew ? `Add ${label.slice(0, -1)}` : `Edit ${label.slice(0, -1)}`}
                    </h3>
                    <button
                        className={styles.modalCloseBtn}
                        onClick={onCancel}
                        aria-label='Close'
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.editForm}>
                        {fields.map((field) => {
                            if (field.type === "custom") {
                                return (
                                    <div
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
                                        {field.render({ recordId, isNew })}
                                    </div>
                                );
                            }

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
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.saveBtn} onClick={onSave}>
                        <Check size={14} /> Save
                    </button>
                    <button className={styles.cancelBtn} onClick={onCancel}>
                        <X size={14} /> Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
