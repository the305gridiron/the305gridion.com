const fetchTransactions = async () => {
    const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/transactions",
    );

    if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
    }

    const data = await response.json();
    return data;
};

export default fetchTransactions;
