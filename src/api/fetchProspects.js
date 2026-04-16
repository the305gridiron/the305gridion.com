const fetchProspects = async (year) => {
    const url = year
        ? `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/prospect?year=${year}`
        : `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/prospect`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch prospects.");
    }

    const data = await response.json();
    return data;
};

export default fetchProspects;