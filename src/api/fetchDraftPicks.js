const fetchDraftPicks = async (year) => {
    const url = year
        ? `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/draft_picks?year=${year}`
        : `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/draft_picks`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch draft picks.");
    }

    const data = await response.json();
    return data;
};

export default fetchDraftPicks;
