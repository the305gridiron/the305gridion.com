import { useState, useEffect, useMemo } from "react";
import ProspectTable from "./ProspectTable/ProspectTable";
import { Hero, PageTitle } from "@/components/layout";
import { Tab, Tabs } from "@/components/ui";
import { fetchProspects } from "@/services/ProspectService";
import { fetchDesignations } from "@/services/DesignationService";
import { ClipLoader } from "react-spinners";

const getDaysUntilDraft = () => {
    const today = new Date();
    const draftDate = new Date("2026-04-23"); // Draft start date
    const diffTime = draftDate - today; // difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
    return diffDays > 0 ? diffDays : 0;
};

export default function BigBoard() {
    const [prospects, setProspects] = useState([]);
    const [designations, setDesignations] = useState({});
    const [loading, setLoading] = useState(false);

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
        return positionOrder.filter((pos) =>
            prospects.some((p) => p.position === pos),
        );
    }, [prospects]);

    const prospectsByPosition = useMemo(() => {
        const grouped = {};
        prospects.forEach((p) => {
            if (!grouped[p.position]) grouped[p.position] = [];
            grouped[p.position].push(p);
        });
        return grouped;
    }, [prospects]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [prospectsData, designationsData] = await Promise.all([
                    fetchProspects(true),
                    fetchDesignations(),
                ]);
                setProspects(prospectsData);
                setDesignations(designationsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <>
            <PageTitle title='Top 150 Prospects - The 305 Gridiron' />
            <div className='draft-page'>
                <Hero>
                    <Hero.Title>Miami Dolphins Draft Board</Hero.Title>
                    <Hero.Promo>
                        The 2026 NFL Draft is just{" "}
                        <strong>
                            {daysAwayFromDraft}{" "}
                            {daysAwayFromDraft === 1 ? "day" : "days"}
                        </strong>{" "}
                        away! Explore our top 150 prospects and see which
                        prospects would be the best fit for our Phins.
                    </Hero.Promo>
                </Hero>
                <main className='container-fluid'>
                    {loading && (
                        <div className='loading'>
                            <ClipLoader
                                color='#007bff'
                                loading={loading}
                                size={50}
                            />
                        </div>
                    )}
                    {!loading && prospects.length === 0 && (
                        <div className='no-results'>
                            <h2>Excuse the Emptyness!</h2>
                            <p>
                                New data is being loaded as we speak, check back
                                soon for the most up-to-date 305 Gridiron Draft
                                Board! 🎉
                            </p>
                        </div>
                    )}
                    {!loading && prospects.length > 0 && (
                        <Tabs defaultActiveKey='ALL'>
                            <Tab key='ALL' tab='ALL'>
                                <ProspectTable
                                    prospects={prospects}
                                    designations={designations}
                                />
                            </Tab>

                            {positionKeys.map((position) => (
                                <Tab key={position} tab={position}>
                                    <ProspectTable
                                        prospects={
                                            prospectsByPosition[position]
                                        }
                                        designations={designations}
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
