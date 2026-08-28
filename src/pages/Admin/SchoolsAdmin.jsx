import { useQuery } from "@tanstack/react-query";
import fetchSchools from "@/api/fetchSchools";
import EntityAdminTable from "./EntityAdminTable";
import styles from "./Admin.module.css";

const QUERY_KEY = ["schools"];

const FIELDS = [
    { name: "full_name", label: "Full Name", type: "text" },
    { name: "short_name", label: "Short Name", type: "text" },
    { name: "abbr", label: "Abbreviation", type: "text" },
];

export default function SchoolsAdmin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: fetchSchools,
    });

    if (isLoading) return <p className={styles.stateMessage}>Loading schools…</p>;
    if (isError) {
        return (
            <p className={styles.stateMessage}>
                Couldn't reach the schools API — local edits will still work
                once it loads.
            </p>
        );
    }

    return (
        <EntityAdminTable
            entity='schools'
            label='Schools'
            sourceRecords={data ?? []}
            queryKey={QUERY_KEY}
            fields={FIELDS}
            getRowLabel={(r) => r.full_name || `School #${r.id}`}
            listColumns={[
                { key: "full_name", label: "Full Name" },
                { key: "short_name", label: "Short Name" },
                { key: "abbr", label: "Abbr" },
            ]}
        />
    );
}
