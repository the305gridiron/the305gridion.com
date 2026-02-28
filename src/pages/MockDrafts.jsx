import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import SportsFootballOutlinedIcon from "@mui/icons-material/SportsFootballOutlined";

import Hero from "../layout/Hero";
import DraftList from "../components/DraftList";
import Sidebar from "../layout/Sidebar";
import SidebarCards from "../components/SidebarCards";
import SidebarCard from "../components/SidebarCard";
import { draftVersions } from "../data/mock-draft";

import styles from "./MockDrafts.module.css";

import MockDraftV1 from "../data/mock-draft/2026-v1.json";

export default function MockDrafts() {
    const [searchParams, setSearchParams] = useSearchParams();

    const requestedYear = searchParams.get("year");
    const requestedVersion = searchParams.get("version");

    const validVersion = draftVersions.find(
        (draft) =>
            draft.year === requestedYear && draft.id === requestedVersion,
    );

    // If invalid or missing, default to latest
    const currentDraft = validVersion || draftVersions[0];

    useEffect(() => {
        if (!validVersion) {
            setSearchParams({
                year: draftVersions[0].year,
                version: draftVersions[0].id,
            });
        }
    }, [validVersion, setSearchParams]);

    return (
        <div className={styles.mockDrafts}>
            <Hero>
                <h1>Mock Draft Central</h1>
                <p className='promo'>
                    Who doesn't love the chaos of draft season? We’re breaking
                    down the best fits, the biggest surprises, and the names you
                    need to know before they hit the big stage.
                </p>
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
                                            <strong>{v.date}</strong>
                                        ) : (
                                            <Link
                                                to={`/mocks?year=${v.year}&version=${v.id}`}
                                            >
                                                {v.date}
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
