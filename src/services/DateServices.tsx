export function getDiffMins(start: Date, end:Date) {
    const diffInMs = Math.floor(end.getTime() - start.getTime());
    return Math.floor(diffInMs / (1000 * 60));
}

export function getDiffHours (start: Date, end:Date) {
    const diffInMs = Math.floor(end.getTime() - start.getTime());
    return Math.floor(diffInMs / (1000 * 60 * 60));
}

export function getDiffDays(start: Date, end:Date) {
    const diffTime = Math.floor(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}


export function getWeeksDiff(start: Date, end:Date) {
    const diffTime = Math.floor(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
}

// Stackoverflow
export function getMonthDiff(start: Date, end:Date) {
    var months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    return months;
}

export const getRemainingTime = (end: string) => {

    const endDateParse = Date.parse(end)
    const endDate = new Date(endDateParse)
    const today = new Date()

    const monthsEnd = getMonthDiff(today, endDate)
    const weeksEnd = getWeeksDiff(today, endDate)
    const daysEnd = getDiffDays(today, endDate)
    const hoursEnd = getDiffHours(today, endDate)
    const minutesEnd = getDiffMins(today, endDate)

    if (monthsEnd > 0) return `Closes in ${monthsEnd} months`
    if (weeksEnd > 0) return `Closes in ${weeksEnd} weeks`
    if (daysEnd > 1) return `Closes in ${daysEnd} days`
    if (daysEnd > 0) return `Closes tomorrow`
    if (hoursEnd > 0) return `closes in ${hoursEnd} hours`
    if (minutesEnd > 0) return `Closes in ${minutesEnd} minutes`
    if (minutesEnd < 0) return `Closed`
    return "Closing Soon"
}


export const getDate = (date: string) => {
    let normalDate = new Date(date);
    return normalDate.toLocaleString("en-NZ");
};

export const getDateFromDate = (date: Date) => {
    return date.toLocaleString("en-NZ");
};