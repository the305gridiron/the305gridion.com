import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import styles from "./PlayerAnalysis.module.scss";

export default function PlayerAnalysis(props) {
    const [expanded, setExpanded] = React.useState();

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const desktopSize = useMediaQuery("(min-width:1200px)");

    return (
        <ExpansionPanel
            id={props.id}
            className={styles.playerAnalysis}
            elevation={0}
            square
            expanded={desktopSize ? true : expanded === `panel${props.id}`}
            onChange={handleChange(`panel${props.id}`)}
        >
            {!desktopSize && (
                <ExpansionPanelSummary
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
                </ExpansionPanelSummary>
            )}

            <ExpansionPanelDetails className={styles.playerAnalysisContent}>
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
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
