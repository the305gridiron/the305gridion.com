import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Accordion } from "@/components/ui";
import styles from "./PlayerAnalysis.module.css";

export default function PlayerAnalysis(props) {
    const [expanded, setExpanded] = React.useState(false);
    const desktopSize = useMediaQuery("(min-width:1200px)");

    const handleChange = (panelId) => {
        setExpanded((prev) => (prev === panelId ? false : panelId));
    };

    return (
        <Accordion
            id={`panel${props.id}`}
            className={styles.playerAnalysis}
            headerClassName={styles.playerAnalysisToggle}
            contentClassName={styles.playerAnalysisContent}
            title='Player Analysis'
            expanded={desktopSize ? true : expanded === `panel${props.id}`}
            onChange={handleChange}
        >
            {props?.analysis
                ? props.analysis
                : "No analysis available just yet... stay tuned!"}
        </Accordion>
    );
}
