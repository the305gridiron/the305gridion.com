import React from "react";
import IconHeader from "./IconHeader";
import DraftCard from "./DraftCard";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";

import styles from "./DraftResults.module.scss";

function DraftResults(props) {
    return (
        <div id="draftResults" className={styles.draftResults}>
            <div className="content-display">
                <IconHeader
                    icon={<TrendingUpOutlinedIcon />}
                    title="Draft Results"
                />
                {props.players && props.players.length > 0 ? (
                    props.players.map((player) => (
                        <DraftCard key={player.details.name} {...player} />
                    ))
                ) : (
                    <p>No one drafted yet!</p>
                )}
            </div>
        </div>
    );
}

export default DraftResults;
