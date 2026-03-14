import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";

import { Hero, Sidebar } from "@/components/layout";
import { DraftList } from "@/components/draft";
import { SidebarCards, SidebarCard } from "@/components/sidebar";
import { draftVersions } from "@/data/mock-draft";

import styles from "./MockDrafts.module.css";

export default function MockDrafts() {
    const [searchParams, setSearchParams] = useSearchParams();

    const requestedYear = Number(searchParams.get("year"));
    const requestedVersion = Number(searchParams.get("version"));

    const validVersion = draftVersions.find(
        (draft) =>
            draft.year === requestedYear && draft.id === requestedVersion,
    );

    // If invalid or missing, default to latest
    const latestDraft = [...draftVersions].sort((a, b) => b.id - a.id)[0];
    const currentDraft = validVersion || latestDraft;

    useEffect(() => {
        if (!validVersion) {
            setSearchParams({
                year: currentDraft.year,
                version: currentDraft.id,
            });
        }
    }, [validVersion, setSearchParams]);

    return (
        <div className={styles.mockDrafts}>
            <Hero>
                <Hero.Title>Miami Dolphins Mock Drafts</Hero.Title>
                <Hero.Promo>
                    Who doesn't love the chaos of draft season? We're breaking
                    down the best fits, the biggest surprises, and the names you
                    need to know for the 2026 NFL Draft.
                </Hero.Promo>
                <p className={styles.lastUpdated}>
                    Version {currentDraft.id} • {currentDraft.date}
                </p>
            </Hero>

            <main className='container-fluid'>
                <DraftList players={currentDraft.data} />
                <Sidebar id='mockDrafts'>
                    <SidebarCards>
                        <SidebarCard>
                            <SidebarCard.Title>
                                2026 Mock Drafts
                            </SidebarCard.Title>
                            <SidebarCard.List>
                                {draftVersions.map((v) => (
                                    <SidebarCard.ListItem
                                        key={`${v.year}-${v.id}`}
                                    >
                                        {v.id === currentDraft.id &&
                                        v.year === currentDraft.year ? (
                                            <strong>
                                                Version {v.id} • {v.date}
                                            </strong>
                                        ) : (
                                            <Link
                                                to={`/mocks?year=${v.year}&version=${v.id}`}
                                            >
                                                Version {v.id} • {v.date}
                                            </Link>
                                        )}
                                    </SidebarCard.ListItem>
                                ))}
                            </SidebarCard.List>
                        </SidebarCard>
                    </SidebarCards>
                </Sidebar>
            </main>
        </div>
    );
}
