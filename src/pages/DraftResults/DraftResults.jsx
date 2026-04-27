import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Hero, Sidebar, PageTitle } from "@/components/layout";
import { DraftList } from "@/components/draft";
import { SidebarCards, FreeAgencyPlayerCard } from "@/components/sidebar";

import { useDraftPicksQuery } from "@/hooks/useDraftPicksQuery";
import { useTransactionQuery } from "@/hooks/useTransactionQuery";
import sidebarMessaging from "@/constants/sidebarMessaging";

import styles from "./DraftResults.module.css";

export default function DraftResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedYear = Number(searchParams.get("year"));

    const { data: draftPicks = [] } = useDraftPicksQuery(requestedYear);
    const { data: udfa = [] } = useTransactionQuery("udfa");

    useEffect(() => {
        if (!requestedYear) {
            setSearchParams({
                year: new Date().getFullYear(),
            });
        }
    }, [requestedYear, setSearchParams]);

    return (
        <>
            <PageTitle title='NFL Draft Results - The 305 Gridiron' />
            <div className={styles.draftResults}>
                <Hero>
                    <Hero.Title>Miami Dolphins Draft Results</Hero.Title>
                    <Hero.Promo>
                        The NFL Draft has begun! Check out our full reactions,
                        instant analysis, and everything the Miami Dolphins do
                        during the draft.
                    </Hero.Promo>
                </Hero>

                <main className='container-fluid'>
                    <DraftList
                        players={draftPicks.sort(
                            (a, b) => a.overall_pick - b.overall_pick,
                        )}
                    />
                    <Sidebar id='draftResults'>
                        <SidebarCards>
                            <FreeAgencyPlayerCard
                                title="Signed UDFA's"
                                players={udfa.map(p => p.player)}
                                messaging={sidebarMessaging.Undrafted}
                            />
                        </SidebarCards>
                    </Sidebar>
                </main>
            </div>
        </>
    );
}
