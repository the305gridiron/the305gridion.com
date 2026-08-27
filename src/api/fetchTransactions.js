// Xano returns the linked players as a raw join (transaction_players_of_
// transactions[].player), one level deeper than the rest of the app wants
// to deal with. Flatten it here, at the API boundary, so everything
// downstream (TransactionCard, the admin panel) can just read
// `transaction.players` as a plain array, same as before this existed.
function flattenTransactionPlayers(transaction) {
    const { transaction_players_of_transactions, ...rest } = transaction;
    const players = (transaction_players_of_transactions ?? [])
        .map((join) => join.player)
        .filter(Boolean);

    return { ...rest, players };
}

const fetchTransactions = async (type) => {
    const url = type
        ? `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/transactions?type=${type}`
        : `https://x8ki-letl-twmt.n7.xano.io/api:ivUQhm7H/transactions`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
    }

    const data = await response.json();
    return data.map(flattenTransactionPlayers);
};

export default fetchTransactions;
