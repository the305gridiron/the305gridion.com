import React, { useState } from "react";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import styles from "./TradeAlert.module.scss";

export default function TradeAlert(props) {
    const [isAlertOpen, setAlertOpen] = useState(false);
    const toggleAlert = () => setAlertOpen(!isAlertOpen);

    return (
        <div
            className={`${styles.tradeAlert} ${isAlertOpen ? styles.tradeAlertOpen : ""
                }`}
        >
            <button className={styles.tradeAlertToggle} onClick={toggleAlert}>
                {isAlertOpen ? (
                    <HighlightOffOutlinedIcon className={styles.iconWiggle} />
                ) : (
                    <NotificationsActiveOutlinedIcon />
                )}
            </button>
            <h4 className={styles.tradeAlertTitle}>Trade Alert!</h4>{" "}
            <div className={styles.tradeAlertDetails}>
                <strong>Miami Dolphins Receive</strong>
                <ul>
                    {props.received.map((pick, index) => (
                        <li key={`received-${index}`}>{pick}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.tradeAlertDetails}>
                <strong>{props.partner} Receive</strong>
                <ul>
                    {props.gave.map((pick, index) => (
                        <li key={`gave-${index}`}>{pick}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
