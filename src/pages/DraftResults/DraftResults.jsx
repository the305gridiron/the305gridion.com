import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Hero, Sidebar, PageTitle } from "@/components/layout";
import { DraftList } from "@/components/draft";
import { SidebarCards, FreeAgencyPlayerCard } from "@/components/sidebar";

import { draftVersions } from "@/data/draft-results";
import { sidebarCardMessaging } from "@/data/transactions/index";

import styles from "./DraftResults.module.css";

export default function DraftResults() {
    const [searchParams, setSearchParams] = useSearchParams();

    const requestedYear = Number(searchParams.get("year"));

    const validVersion = draftVersions.find(
        (draft) => draft.year === requestedYear,
    );

    // If invalid or missing, default to latest
    const latestDraft = [...draftVersions].sort((a, b) => b.year - a.year)[0];
    const currentDraft = validVersion || latestDraft;

    useEffect(() => {
        if (!validVersion) {
            setSearchParams({
                year: currentDraft.year,
            });
        }
    }, [validVersion, setSearchParams]);

    return (
        <>
            <PageTitle title='NFL Draft Results - The 305 Gridiron' />
            <div className={styles.draftResults}>
                <Hero>
                    <Hero.Title>Miami Dolphins Draft Results</Hero.Title>
                    <Hero.Promo>
                        The 2026 NFL Draft is on the horizon, but the picks
                        aren't in just yet. Check back on April 23rd for all the
                        best reactions to the Miami Dolphins 2026 Draft.
                    </Hero.Promo>
                </Hero>

                <main className='container-fluid'>
                    <DraftList players={currentDraft.data.results} />
                    <Sidebar id='draftResults'>
                        <SidebarCards>
                            <FreeAgencyPlayerCard
                                title="Signed UDFA's"
                                players={currentDraft.data.udfa}
                                messaging={sidebarCardMessaging.Undrafted}
                            />
                        </SidebarCards>
                    </Sidebar>
                </main>
            </div>
        </>
    );
}
