import { Loader2 } from "lucide-react";
import styles from "./Admin.module.css";

// Shown while a write to Xano is in flight (push, push-all, delete) so it's
// never ambiguous whether something finished or just silently did nothing.
export default function SavingOverlay({ label = "Saving…" }) {
    return (
        <div className={styles.savingOverlay}>
            <div className={styles.savingPanel}>
                <Loader2 size={20} className={styles.savingSpinner} />
                <span>{label}</span>
            </div>
        </div>
    );
}
