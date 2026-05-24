import { env } from "../../config/env.js";

export function getRuntimeContext() {
    const now = new Date();

    return {
        currentDateTime: now.toISOString(),
        timezone: env.TIMEZONE,
        localDate: formatDate(now),
        localTime: formatTime(now),
        locale: "he-IL",
    };
}

function formatDate(date) {
    return new Intl.DateTimeFormat("he-IL", {
        timeZone: env.TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "long",
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat("he-IL", {
        timeZone: env.TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).format(date);
}
