const fetchExpiringContracts = async () => {
    const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/expiring_contracts",
    );

    if (!response.ok) {
        throw new Error("Failed to fetch expiring contracts.");
    }

    const data = await response.json();
    return data;
};

export default fetchExpiringContracts;
