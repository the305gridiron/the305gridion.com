import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "./Pagination.module.css";

// Builds a compact page list like [1, "…", 4, 5, 6, "…", 12] instead of a
// button for every single page once there are a lot of them.
function getPageNumbers(currentPage, totalPages) {
    const delta = 1;
    const range = [];
    const withDots = [];
    let last;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            range.push(i);
        }
    }

    range.forEach((i) => {
        if (last) {
            if (i - last === 2) {
                withDots.push(last + 1);
            } else if (i - last > 2) {
                withDots.push("…");
            }
        }
        withDots.push(i);
        last = i;
    });

    return withDots;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <nav className={styles.pagination} aria-label='Pagination'>
            <button
                type='button'
                className={styles.navBtn}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label='Previous page'
            >
                <ChevronLeftIcon />
            </button>

            {getPageNumbers(currentPage, totalPages).map((page, index) =>
                page === "…" ? (
                    <span key={`dots-${index}`} className={styles.dots}>
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        type='button'
                        className={`${styles.pageBtn} ${
                            page === currentPage ? styles.pageBtnActive : ""
                        }`}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                type='button'
                className={styles.navBtn}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label='Next page'
            >
                <ChevronRightIcon />
            </button>
        </nav>
    );
}
