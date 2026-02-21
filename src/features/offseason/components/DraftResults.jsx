import React from "react";
import IconHeader from "./IconHeader";
import DraftCard from "./DraftCard";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import styles from "./DraftResults.module.scss";

function DraftResults(props) {
    return (
        <div id="draftResults" className={styles.draftResults}>
            <div className="content-display">
                <IconHeader
                    icon={<TrendingUpOutlinedIcon />}
                    title={props.mockDraft ? "Mock Draft" : "Draft Results"}
                />
                <div className={styles.draftCards}>
                    {props.players && props.players.length > 0 ? (
                        props.players.map((player) => (
                            <DraftCard key={player.id} {...player} />
                        ))
                    ) : (
                        <p>No one drafted yet!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DraftResults;
