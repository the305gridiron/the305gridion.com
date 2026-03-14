import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Layout / Components
import { Hero, Sidebar, MobileNav } from "@/components/layout";
import { SidebarCards, FreeAgencyPlayerCard } from "@/components/sidebar";
import { IconHeader } from "@/components/ui";
import { ScrollToTop } from "@/components/utils";
import TransactionList from "./TransactionList/TransactionList";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

// Styles
import styles from "./Transactions.module.css";

// Data
import {
    sidebarCardMessaging,
    seasonalTransactions,
} from "@/data/transactions/index";

// Sort transactions by date
const sortTransactionsByDateDesc = (transactions) =>
    [...transactions].sort((a, b) => {
        const aDate = new Date(a.date); // parses "3/11/26" correctly
        const bDate = new Date(b.date);

        const dateDiff = bDate - aDate; // newest first
        if (dateDiff !== 0) return dateDiff;

        // if same date, compare id (assuming id format like "TRANS-2026-16")
        const aIdNum = parseInt(a.id.split("-").pop(), 10);
        const bIdNum = parseInt(b.id.split("-").pop(), 10);

        return bIdNum - aIdNum; // higher id first
    });

export default function Offseason() {
    const isMobile = useMediaQuery("(max-width:767px)");
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const requestedYear = searchParams.get("year");

    // Determine valid year or default to latest
    const validYear = useMemo(
        () =>
            seasonalTransactions.find((t) => t.id === requestedYear) ||
            seasonalTransactions[0],
        [requestedYear],
    );

    const currentTransactions = validYear.data.transactions;
    const currentUnsigned = validYear.data.unsigned;

    const mobileLinks = useMemo(
        () => [
            {
                icon: <KeyboardDoubleArrowDownIcon />,
                link: "#expiringContracts",
                text: "Expiring Contracts",
            },
        ],
        [],
    );

    // Filter transactions based on type
    const handleTypeChange = (type) => {
        if (!type || type === "all") {
            setFilteredTransactions(
                sortTransactionsByDateDesc(currentTransactions),
            );
            return;
        }

        const filtered = currentTransactions.filter((t) => {
            if (type === "addition") {
                return (
                    t.type === "addition" ||
                    t.type === "tendered" ||
                    t.type === "resigned"
                );
            }

            if (type === "trade") {
                return t.type === "trade_away" || t.type === "trade_for";
            }

            return t.type === type;
        });

        setFilteredTransactions(sortTransactionsByDateDesc(filtered));
    };

    // Initialize filteredTransactions whenever the year changes
    useEffect(() => {
        if (!requestedYear) {
            setSearchParams({ year: seasonalTransactions[0].id });
        }
        setFilteredTransactions(
            sortTransactionsByDateDesc(currentTransactions),
        );
    }, [currentTransactions, requestedYear, setSearchParams]);

    return (
        <div className={`offseason-page ${styles.offseasonPage}`}>
            <Hero>
                <Hero.Title>Miami Dolphins Offseason Tracker</Hero.Title>
                <Hero.Promo>
                    From trades and cuts to free agent signings, we're breaking
                    down the biggest moves, the surprises, and the names you
                    need to watch in the 2026 offseason.
                </Hero.Promo>

                {isMobile && <MobileNav links={mobileLinks} />}
            </Hero>

            <main className='container-fluid'>
                <TransactionList
                    players={filteredTransactions}
                    onTypeChange={handleTypeChange}
                />

                <Sidebar id='expiringContracts'>
                    <IconHeader
                        icon={<ContentPasteOffIcon />}
                        title='Expiring Contracts'
                    />
                    <SidebarCards>
                        <FreeAgencyPlayerCard
                            title='Unsigned'
                            hideTitle={true}
                            players={currentUnsigned}
                            messaging={sidebarCardMessaging.Unsigned}
                        />
                    </SidebarCards>
                </Sidebar>
            </main>

            <ScrollToTop />
        </div>
    );
}
