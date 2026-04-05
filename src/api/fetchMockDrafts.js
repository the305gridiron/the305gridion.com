const fetchMockDrafts = async () => {
    const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/mock_drafts",
    );

    if (!response.ok) {
        throw new Error("Failed to fetch mock drafts.");
    }

    const data = await response.json();
    return data;
};

export default fetchMockDrafts;