import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Layout / Components
import Hero from "../layout/Hero";
import Sidebar from "../layout/Sidebar";
import SidebarCards from "../components/SidebarCards";
import FreeAgencyPlayerCard from "../components/FreeAgencyPlayerCard";
import MobileNav from "../components/MobileNav";
import IconHeader from "../components/IconHeader";
import TransactionList from "../components/TransactionList";
import ScrollToTop from "../features/offseason/components/ScrollToTop";

// MUI
import useMediaQuery from "@mui/material/useMediaQuery";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

// Styles
import styles from "./Transactions.module.css";

// Data
import { sidebarCardMessaging, seasonalTransactions } from "../data/transactions/index";

export default function Offseason() {
    const isMobile = useMediaQuery("(max-width:767px)");
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const requestedYear = searchParams.get("year");

    // Determine valid year or default to latest
    const validYear = useMemo(
        () => seasonalTransactions.find((t) => t.id === requestedYear) || seasonalTransactions[0],
        [requestedYear]
    );

    const currentTransactions = validYear.data.transactions;
    const currentUnsigned = validYear.data.unsigned;

    const mobileLinks = useMemo(() => [
        {
            icon: <KeyboardDoubleArrowDownIcon />,
            link: "#expiringContracts",
            text: "Expiring Contracts",
        },
    ], []);

    // Initialize filteredTransactions whenever the year changes
    useEffect(() => {
        if (!requestedYear) {
            setSearchParams({ year: seasonalTransactions[0].id });
        }
        setFilteredTransactions([...currentTransactions].reverse());
    }, [currentTransactions, requestedYear, setSearchParams]);

    // Filter transactions based on type
    const handleTypeChange = (type) => {
        if (!type || type === "all") {
            setFilteredTransactions([...currentTransactions].reverse());
            return;
        }

        // Treat "addition" as including "tendered"
        const filtered = currentTransactions.filter((t) =>
            type === "addition" ? t.type === "addition" || t.type === "tendered" : t.type === type
        );

        setFilteredTransactions([...filtered].reverse());
    };

    return (
        <div className={`offseason-page ${styles.offseasonPage}`}>
            <Hero>
                <Hero.Title>2026 Offseason Tracker</Hero.Title>
                <Hero.Promo>
                    From trades and cuts to free agent signings, we're breaking down the
                    biggest moves, the surprises, and the names you need to watch in the
                    2026 offseason.
                </Hero.Promo>

                {isMobile && <MobileNav links={mobileLinks} />}
            </Hero>

            <main className="container-fluid">
                <TransactionList
                    players={filteredTransactions}
                    onTypeChange={handleTypeChange}
                />

                <Sidebar id="expiringContracts">
                    <IconHeader
                        icon={<ContentPasteOffIcon />}
                        title="Expiring Contracts"
                    />
                    <SidebarCards>
                        <FreeAgencyPlayerCard
                            title="Unsigned"
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