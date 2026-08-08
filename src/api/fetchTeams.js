const fetchTeams = async () => {
    const url = "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/teams";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch teams.");
    }

    const data = await response.json();
    return data;
};

export default fetchTeams;