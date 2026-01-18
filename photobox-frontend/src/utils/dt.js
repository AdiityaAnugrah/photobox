export function toLocalInputValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function nowPlusMinutes(min) {
    const d = new Date();
    d.setMinutes(d.getMinutes() + min);
    return toLocalInputValue(d);
}

export function minutesBetween(startISO, endISO) {
    const s = new Date(startISO).getTime();
    const e = new Date(endISO).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
    return Math.round((e - s) / 60000);
}
