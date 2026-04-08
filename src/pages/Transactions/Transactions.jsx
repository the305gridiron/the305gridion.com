import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Layout / Components
import { Hero, Sidebar, MobileNav, PageTitle } from "@/components/layout";
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
import { sidebarCardMessaging } from "@/data/transactions/index";
import { useTransactionQuery } from "@/hooks/useTransactionQuery";
import { useExpiringContractsQuery } from "@/hooks/useExpiringContractsQuery";

// Constants / Static Config
const MOBILE_LINKS = [
    {
        icon: <KeyboardDoubleArrowDownIcon />,
        link: "#expiringContracts",
        text: "Expiring Contracts",
    },
];

// Utilities
const sortTransactionsByDateDesc = (transactions) =>
    [...transactions].sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;

        return b.id - a.id;
    });

export default function Offseason() {
    // Hooks
    const isMobile = useMediaQuery("(max-width:767px)");
    const [searchParams, setSearchParams] = useSearchParams();
    const [typeFilter, setTypeFilter] = useState("all");

    const { data: transactions = [] } = useTransactionQuery();
    const { data: unsigned = [] } = useExpiringContractsQuery();

    const requestedYear = searchParams.get("year");
    const year = requestedYear ? parseInt(requestedYear, 10) : null;

    // Derived Data
    const filteredTransactions = useMemo(() => {
        if (!transactions || !year) return [];

        let result = transactions.filter((t) => t.year === year);

        if (typeFilter !== "all") {
            result = result.filter((t) => t.category === typeFilter);
        }

        return sortTransactionsByDateDesc(result);
    }, [transactions, year, typeFilter]);

    // Handlers
    const handleTypeChange = (type) => {
        setTypeFilter(type || "all");
    };

    // Effects
    useEffect(() => {
        if (!requestedYear && transactions?.length) {
            const latestYear = Math.max(...transactions.map((t) => t.year));
            setSearchParams({ year: latestYear });
        }
    }, [requestedYear, transactions, setSearchParams]);

    // Render
    return (
        <>
            <PageTitle title='Transactions - The 305 Gridiron' />

            <div className={`offseason-page ${styles.offseasonPage}`}>
                <Hero>
                    <Hero.Title>Miami Dolphins Offseason Tracker</Hero.Title>

                    <Hero.Promo>
                        From trades and cuts to free agent signings, we're
                        breaking down the biggest moves, the surprises, and the
                        names you need to watch in the 2026 offseason.
                    </Hero.Promo>

                    {isMobile && <MobileNav links={MOBILE_LINKS} />}
                </Hero>

                <main className='container-fluid'>
                    <TransactionList
                        transactions={filteredTransactions}
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
                                hideTitle
                                players={unsigned}
                                messaging={sidebarCardMessaging.Unsigned}
                            />
                        </SidebarCards>
                    </Sidebar>
                </main>

                <ScrollToTop />
            </div>
        </>
    );
}
