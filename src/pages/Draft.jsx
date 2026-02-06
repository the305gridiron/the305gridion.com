import React, { useState, useCallback, useEffect } from "react";
import { Container, ProspectTable, Tabs, Tab, PageHeader } from "../features/draft/components";
import { fetchProspects } from "../features/draft/services/ProspectService";
import { fetchDesignations } from "../features/draft/services/DesignationService";
import { ClipLoader } from "react-spinners";

import "../features/draft/styles/global.css";

export default function Draft() {
    const [prospects, setProspects] = useState({});
    const [designations, setDesignations] = useState({});
    const [loading, setLoading] = useState(true);
    const positionKeys = Object.keys(prospects);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [prospectsData, designationsData] = await Promise.all([
                fetchProspects(),
                fetchDesignations(),
            ]);
            setProspects(prospectsData);
            setDesignations(designationsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <Container>
                <div className="loading">
                    <ClipLoader color="#007bff" loading={loading} size={50} />
                </div>
            </Container>
        );
    }

    return (
        <>
            <PageHeader />
            <Container>
                <Tabs defaultActiveKey="QB">
                    {positionKeys.map((position) => (
                        <Tab key={position} tab={position}>
                            <ProspectTable
                                prospects={prospects[position]}
                                designations={designations}
                            />
                        </Tab>
                    ))}
                </Tabs>
            </Container>
        </>
    );
}
