const fetchTransactions = async (type) => {
    const url = type
        ? `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/transactions?type=${type}`
        : `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/transactions`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
    }

    const data = await response.json();
    return data;
};

export default fetchTransactions;
