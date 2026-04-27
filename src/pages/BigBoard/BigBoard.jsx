import { useState, useEffect, useMemo } from "react";
import ProspectTable from "./ProspectTable/ProspectTable";
import { Hero, PageTitle } from "@/components/layout";
import { Tab, Tabs } from "@/components/ui";
import { ClipLoader } from "react-spinners";

// Data
import { useProspectsQuery } from "../../hooks/useProspectsQuery";

// Styles
import styles from "./BigBoard.module.css";

const getDaysUntilDraft = () => {
    const today = new Date();
    const draftDate = new Date("2026-04-23"); // Draft start date
    const diffTime = draftDate - today; // difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays > 0 ? diffDays : 0;
};

export default function BigBoard() {
    const { data: prospects = [], isLoading } = useProspectsQuery(2026);
    const daysAwayFromDraft = useMemo(() => getDaysUntilDraft(), []);

    const positionOrder = [
        "QB",
        "RB",
        "WR",
        "TE",
        "OT",
        "IOL",
        "EDGE",
        "DL",
        "LB",
        "CB",
        "S",
    ];

    const positionKeys = useMemo(() => {
        const positions = positionOrder.filter((pos) =>
            prospects.some((p) => p.position === pos),
        );
        return ["OFFENSE", "DEFENSE", ...positions];
    }, [prospects]);

    const prospectsByPosition = useMemo(() => {
        const grouped = { OFFENSE: [], DEFENSE: [] };
        prospects.forEach((p) => {
            if (["QB", "RB", "WR", "TE", "OT", "IOL"].includes(p.position)) {
                grouped["OFFENSE"].push(p);
            }

            if (["EDGE", "DL", "LB", "CB", "S"].includes(p.position)) {
                grouped["DEFENSE"].push(p);
            }

            if (!grouped[p.position]) grouped[p.position] = [];
            grouped[p.position].push(p);
        });
        return grouped;
    }, [prospects]);

    return (
        <>
            <PageTitle title='Top 150 Prospects - The 305 Gridiron' />
            <div className='draft-page'>
                <Hero>
                    <Hero.Title>Miami Dolphins Draft Board</Hero.Title>
                    <Hero.Promo>
                        Dive into our top 150 prospects and see who we believe
                        fits best in Miami as we track every potential Dolphins
                        target in real time.
                        <ul className={styles.tierKey}>
                            <li>Core Target</li>
                            <li>Strong Fit</li>
                            <li>Conditional</li>
                            <li>Avoid/Depth</li>
                        </ul>
                    </Hero.Promo>
                </Hero>
                <main className='container-fluid'>
                    {isLoading && (
                        <div className='loading'>
                            <ClipLoader
                                color='#007bff'
                                loading={isLoading}
                                size={50}
                            />
                        </div>
                    )}
                    {!isLoading && prospects.length === 0 && (
                        <div className='no-results'>
                            <h2>Excuse the Emptyness!</h2>
                            <p>
                                New data is being loaded as we speak, check back
                                soon for the most up-to-date 305 Gridiron Draft
                                Board! 🎉
                            </p>
                        </div>
                    )}
                    {!isLoading && prospects.length > 0 && (
                        <Tabs defaultActiveKey='ALL'>
                            <Tab key='ALL' tab='ALL'>
                                <ProspectTable
                                    prospects={prospects.sort(
                                        (a, b) => a.draft_rank - b.draft_rank,
                                    )}
                                />
                            </Tab>

                            {positionKeys.map((position) => (
                                <Tab key={position} tab={position}>
                                    <ProspectTable
                                        prospects={
                                            prospectsByPosition[position]
                                        }
                                    />
                                </Tab>
                            ))}
                        </Tabs>
                    )}
                </main>
            </div>
        </>
    );
}
