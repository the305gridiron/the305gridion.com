// "2026-03-09" -> "03.09.26" for admin table list columns. Xano returns
// these as plain "YYYY-MM-DD" strings (same format the underlying
// <input type="date"> field reads/writes), so this is a display-only
// reformat — never touches what's actually saved.
export function formatDateShort(dateStr) {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    return `${month}.${day}.${year.slice(2)}`;
}
