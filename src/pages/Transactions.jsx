import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

// Styles
import styles from "./Transactions.module.css";

// Data

import {
    sidebarCardMessaging,
    seasonalTransactions,
} from "../data/transactions/index";
import FreeAgents from "../features/offseason/data/fa/2026.json";

export default function Offseason() {
    const isMobile = useMediaQuery("(max-width:767px)");
    const [searchParams, setSearchParams] = useSearchParams();

    const requestedYear = searchParams.get("year");

    const validYear = seasonalTransactions.find((t) => t.id === requestedYear);

    // If invalid or missing, default to latest
    const currentTransactions =
        validYear?.data?.transactions ||
        seasonalTransactions[0]?.data?.transactions;

    console.log(currentTransactions);

    useEffect(() => {
        if (!validYear) {
            setSearchParams({
                year: seasonalTransactions[0].id,
            });
        }
    }, [validYear, setSearchParams]);

    return (
        <div className={`offseason-page ${styles.offseasonPage}`}>
            <Hero>
                <h1>2026 Offseason Tracker</h1>
                <p className='promo'>
                    From trades and cuts to free agent signings, we're breaking
                    down the biggest moves, the surprises, and the names you
                    need to watch in the 2026 offseason.
                </p>

                {isMobile && <MobileNav />}
            </Hero>

            <main className='container-fluid'>
                <TransactionList players={[...currentTransactions].reverse()} />
                <Sidebar id='freeAgency'>
                    <IconHeader
                        icon={<ContentPasteOffIcon />}
                        title='Expiring Contracts'
                    />
                    <SidebarCards>
                        <FreeAgencyPlayerCard
                            title='Unsigned'
                            players={FreeAgents?.unsigned}
                            messaging={sidebarCardMessaging.Unsigned}
                        />
                    </SidebarCards>
                </Sidebar>
            </main>

            <ScrollToTop />
        </div>
    );
}
