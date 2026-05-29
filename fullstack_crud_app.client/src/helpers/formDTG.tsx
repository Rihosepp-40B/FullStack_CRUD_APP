export const formDTG = (isoString: string): string => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (isNaN(date.getTime())) return isoString;

    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);

    return `${day} ${hour}${minute} ${month}${year}`
}