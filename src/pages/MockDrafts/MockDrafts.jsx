import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Hero, Sidebar, PageTitle } from "@/components/layout";
import { DraftList } from "@/components/draft";
import { SidebarCards, SidebarCard } from "@/components/sidebar";
import { useMockDraftsQuery } from "@/hooks/useMockDraftsQuery";

import styles from "./MockDrafts.module.css";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

export default function MockDrafts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading } = useMockDraftsQuery();

    const draftVersions = useMemo(() => {
        if (!data) return [];

        return Array.from(
            new Map(
                data.map((d) => [
                    `${d.version}-${d.date}`,
                    {
                        id: d.version,
                        year: new Date(d.date).getFullYear(),
                        date: d.date,
                    },
                ]),
            ).values(),
        ).sort((a, b) => a.id - b.id);
    }, [data]);

    const requestedYear = Number(searchParams.get("year"));
    const requestedVersion = Number(searchParams.get("version"));
    const validVersion = draftVersions.find(
        (draft) =>
            draft.year === requestedYear && draft.id === requestedVersion,
    );

    const latestDraft = [...draftVersions].sort((a, b) => b.id - a.id)[0];
    const currentDraft = validVersion || latestDraft;

    const currentDraftData = data
        ?.filter(
            (draft) =>
                draft.version === currentDraft?.id &&
                new Date(draft.date).getFullYear() === currentDraft?.year,
        )
        ?.sort((a, b) => a.overall_pick - b.overall_pick);

    useEffect(() => {
        if (!isLoading && !validVersion && currentDraft) {
            setSearchParams({
                year: currentDraft.year,
                version: currentDraft.id,
            });
        }
    }, [isLoading, validVersion, currentDraft, setSearchParams]);

    if (isLoading) return <p>Loading the gridiron...</p>;
    if (!data) return <p>No draft data found.</p>;

    return (
        <>
            <PageTitle title='Mock Drafts - The 305 Gridiron' />
            <div className={styles.mockDrafts}>
                <Hero>
                    <Hero.Title>Miami Dolphins Mock Drafts</Hero.Title>
                    <Hero.Promo>
                        Who doesn't love the chaos of draft season? We're
                        breaking down the best fits, the biggest surprises, and
                        the names you need to know for the 2026 NFL Draft.
                    </Hero.Promo>
                    <p className={styles.lastUpdated}>
                        Version {currentDraft?.id} •{" "}
                        {formatDate(currentDraft?.date)}
                    </p>
                </Hero>

                <main className='container-fluid'>
                    <DraftList players={currentDraftData} />
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
                                            {v.id === currentDraft?.id &&
                                            v.year === currentDraft?.year ? (
                                                <strong>
                                                    Version {v.id} •{" "}
                                                    {formatDate(v.date)}
                                                </strong>
                                            ) : (
                                                <Link
                                                    to={`/mocks?year=${v.year}&version=${v.id}`}
                                                >
                                                    Version {v.id} •{" "}
                                                    {formatDate(v.date)}
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
        </>
    );
}
