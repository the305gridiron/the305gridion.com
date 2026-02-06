import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import SwapHorizOutlinedIcon from "@material-ui/icons/SwapHorizOutlined";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import styles from "./SidebarPlayerPanel.module.scss";

const ExpansionPanel = withStyles({
    root: {
        backgroundColor: "inherit",
        border: "0",
        boxShadow: "none",
        color: "inherit",
        margin: 0,
        padding: 0,
        "&$expanded": {
            margin: 0,
        },
        "&$disabled": {
            color: "white",
        },
    },
    expanded: {},
    disabled: { color: "white" },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: "inherit",
        borderBottom: "0",
        fontWeight: 400,
        marginBottom: 0,
        minHeight: 0,
        padding: "5px 15px",
        "&$expanded": {
            fontWeight: 600,
            minHeight: 0,
        },
    },
    content: {
        alignItems: "center",
        margin: 0,
        "&$expanded": {
            margin: "0",
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
    root: {
        padding: "0 15px 15px",
    },
}))(MuiExpansionPanelDetails);

export default function SidebarPlayerPanel(props) {
    return (
        <ExpansionPanel
            className={styles.sidebarCardListItem}
            square
            expanded={props.expanded === `panel${props.id}`}
            onChange={props.handleChange(`panel${props.id}`)}
        >
            <ExpansionPanelSummary
                aria-controls={`panel${props.id}id-content`}
                id={`panel${props.id}id-header`}
            >
                <span className={styles.playerPosition}>{props.position}</span>{" "}
                {props.name}{" "}
                {props.trade && (
                    <SwapHorizOutlinedIcon className={styles.tradeIcon} />
                )}
                {props.expanded === `panel${props.id}` ? (
                    <KeyboardArrowUpIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                ) : (
                    <KeyboardArrowDownIcon
                        className={styles.sidebarCardListItemToggleIcon}
                    />
                )}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
                className={styles.sidebarCardListItemDetails}
            >
                <ul className={styles.playerDetails}>
                    {props.age && (
                        <li>
                            <strong>Age:</strong>
                            {props.age}
                        </li>
                    )}
                    {props.formerTeam && (
                        <li>
                            <strong>Former Team:</strong> {props.formerTeam}
                        </li>
                    )}
                    {props.comments && <li>{props.comments}</li>}
                    {props.profile && (
                        <li>
                            <OutboundLink
                                href={props.profile}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Player Profile
                            </OutboundLink>
                        </li>
                    )}
                </ul>

                {props.contract && (
                    <ul className={styles.contractDetails}>
                        <li className={styles.contractDetailsTitle}>
                            Contract Details
                        </li>
                        <li>
                            <strong>Length:</strong>{" "}
                            {props.contract.years &&
                                `${props.contract.years} ${
                                    props.contract.years > 1 ? "years" : "year"
                                }`}
                        </li>
                        <li>
                            <strong>Total:</strong>
                            {props.contract.total && props.contract.total}
                        </li>
                        {props.contract.years > 1 && props.contract.average && (
                            <li>
                                <strong>Average:</strong>{" "}
                                {props.contract.average}
                            </li>
                        )}
                        {props.contract.guaranteed && (
                            <li>
                                <strong>Guaranteed:</strong>
                                {props.contract.guaranteed}
                            </li>
                        )}
                        <li>
                            <strong>2020 Cap:</strong>{" "}
                            {props.contract.cap && props.contract.cap}
                        </li>
                        {props.contract.out && (
                            <li>
                                <strong>Potential Out:</strong>{" "}
                                {props.contract.out}
                            </li>
                        )}
                    </ul>
                )}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
