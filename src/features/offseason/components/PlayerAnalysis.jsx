import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./PlayerAnalysis.module.scss";

export default function PlayerAnalysis(props) {
    const [expanded, setExpanded] = React.useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const desktopSize = useMediaQuery("(min-width:1200px)");

    return (
        <Accordion
            id={props.id}
            className={styles.playerAnalysis}
            elevation={0}
            square
            expanded={desktopSize ? true : expanded === `panel${props.id}`}
            onChange={handleChange(`panel${props.id}`)}
        >
            {!desktopSize && (
                <AccordionSummary
                    aria-controls={`panel${props.id}id-content`}
                    id={`panel${props.id}id-header`}
                    className={styles.playerAnalysisToggle}
                >
                    Player Analysis
                    {expanded === `panel${props.id}` ? (
                        <KeyboardArrowUpIcon />
                    ) : (
                        <KeyboardArrowDownIcon />
                    )}
                </AccordionSummary>
            )}

            <AccordionDetails className={styles.playerAnalysisContent}>
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
            </AccordionDetails>
        </Accordion>
    );
}
