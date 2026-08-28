import { Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/admin/AuthContext";
import styles from "./AdminFab.module.css";

// Only surface exists for admins to get back into /admin from anywhere on
// the live site — there's no nav link to it anywhere else.
export default function AdminFab() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (!isAuthenticated || location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <button
            type='button'
            className={styles.fab}
            aria-label='Open admin panel'
            onClick={() => navigate("/admin")}
        >
            <Pencil size={22} />
        </button>
    );
}
