import React, { useRef, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import styles from "./Accordion.module.css";

export default function Accordion({ id, className, expanded, onChange, children }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState("0px");

    useEffect(() => {
        if (expanded) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setHeight("0px");
        }
    }, [expanded]);

    return (
        <div className={`${styles.accordion} ${className}`}>
            {/* Header only on mobile */}
            {typeof onChange === "function" && (
                <button
                    className={styles.accordionHeader}
                    onClick={() => onChange(id)}
                    aria-expanded={expanded}
                >
                    Player Analysis
                    <span className={styles.accordionIcon}>
                        {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </span>
                </button>
            )}

            {/* Content */}
            <div
                ref={contentRef}
                className={styles.accordionContent}
                style={{
                    maxHeight: height,
                }}
            >
                {children}
            </div>
        </div>
    );
};
