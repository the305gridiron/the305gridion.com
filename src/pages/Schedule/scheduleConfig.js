// Parses a game_date value safely for all the shapes you might store:
// - a numeric epoch timestamp in milliseconds, e.g. 1789935900000 — this
//   may arrive as an actual number or as a numeric string like
//   "1789935900000" depending on how the API serializes it, so both are
//   treated the same way (carries full date + time)
// - date-only string, "2026-08-14" (no time-of-day info)
// - full ISO timestamp string, "2026-08-14T19:00:00-04:00"
// A date-only string can't just be handed to `new Date()` — JS treats it
// as UTC midnight, which in any US timezone rolls back to the previous
// calendar day once converted to local time for display. Parsing the
// date-only case as local year/month/day avoids that shift entirely.
function isEpochTimestamp(dateValue) {
    return (
        typeof dateValue === "number" ||
        (typeof dateValue === "string" && /^\d+$/.test(dateValue))
    );
}

function parseGameDate(dateValue) {
    if (dateValue === null || dateValue === undefined || dateValue === "") {
        return null;
    }

    if (isEpochTimestamp(dateValue)) {
        const date = new Date(Number(dateValue));
        return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof dateValue === "string" && !dateValue.includes("T")) {
        const [year, month, day] = dateValue.split("-").map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }

    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function getYouTubeVideoId(url) {
    if (!url) return null;

    const trimmed = url.trim();

    // A bare 11-character video ID, no URL at all
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    const match = trimmed.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url) {
    const id = getYouTubeVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
}

// "FRI 08.14"
export function formatGameDateShort(dateValue) {
    const date = parseGameDate(dateValue);
    if (!date) return "TBD";

    const weekday = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${weekday} ${month}.${day}`;
}

// "7:00 PM ET" — returns null (not a wrong time) when the stored value is
// a date-only string with no actual kickoff time to report. A numeric
// timestamp (number or numeric string) or a full ISO string all carry
// real time-of-day info.
export function formatGameTime(dateValue) {
    if (
        !isEpochTimestamp(dateValue) &&
        typeof dateValue === "string" &&
        !dateValue.includes("T")
    ) {
        return null;
    }

    const date = parseGameDate(dateValue);
    if (!date) return null;

    return date
        .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
        })
        .toUpperCase();
}

export function getMatchupLabel(locationType) {
    if (!locationType) return "";
    return locationType === "HOME" ? "vs" : "@";
}

// "W 24-17"
export function formatScoreLine(result, dolphins_score, opponents_score) {
    if (!result) return null;
    return `${result} ${dolphins_score}-${opponents_score}`;
}

const STATE_ABBREVIATIONS = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    "District of Columbia": "DC",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
};

export function getStateAbbreviation(stateName) {
    if (!stateName) return "";
    return STATE_ABBREVIATIONS[stateName] || stateName;
}

// "Northwest Stadium · Landover, MD"
export function formatLocationLine(location) {
    if (!location) return "";

    const stateAbbr = getStateAbbreviation(location.state);
    const cityState = location.city
        ? stateAbbr
            ? `${location.city}, ${stateAbbr}`
            : location.city
        : "";

    if (location.name && cityState) {
        return `${location.name} \u00B7 ${cityState}`;
    }

    return location.name || cityState;
}