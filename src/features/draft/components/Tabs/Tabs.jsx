// Tabs.jsx
import React, { useState } from "react";
import styles from "./Tabs.module.css";

const Tabs = ({ children, defaultActiveKey }) => {
    const [activeKey, setActiveKey] = useState(
        defaultActiveKey || children[0].key
    );

    const handleSelect = (key) => {
        setActiveKey(key);
    };

    const renderNav = () => {
        return (
            <>
                <ul className={styles["nav-tabs"]}>
                    {React.Children.map(children, (child) => (
                        <li className={styles["nav-item"]} key={child.key}>
                            <button
                                className={`${styles["nav-link"]} ${activeKey === child.key ? styles.active : ""
                                    }`}
                                onClick={() => handleSelect(child.key)}
                            >
                                {child.props.tab}
                            </button>
                        </li>
                    ))}
                </ul>
                <div className={styles["nav-dropdown"]}>
                    <select
                        className={styles["nav-dropdown-select"]}
                        value={activeKey}
                        onChange={(e) => handleSelect(e.target.value)}
                    >
                        {React.Children.map(children, (child) => (
                            <option value={child.key} key={child.key}>
                                {child.props.tab}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        );
    };

    const renderContent = () => {
        return (
            <div className={styles["tab-content"]}>
                {React.Children.map(children, (child) => (
                    <div
                        className={`${styles["tab-pane"]} ${activeKey === child.key ? styles.active : ""
                            }`}
                        key={child.key}
                    >
                        {child.props.children}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='tabs-container'>
            {renderNav()}
            {renderContent()}
        </div>
    );
};

export default Tabs;
