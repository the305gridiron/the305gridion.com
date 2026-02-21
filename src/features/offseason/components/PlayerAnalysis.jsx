import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from "./Accordion";

import styles from "./PlayerAnalysis.module.scss";

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
            expanded={desktopSize ? true : expanded === `panel${props.id}`}
            onChange={handleChange}
        >
            {props.quote
                ? props.quote
                : "Player analysis will be available when a player is selected."}

            {props.cite.link && props.cite.text && (
                <a
                    className={styles.playerAnalysisCite}
                    href={props.cite.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {props.cite.text}
                </a>
            )}
        </Accordion>
    );
}