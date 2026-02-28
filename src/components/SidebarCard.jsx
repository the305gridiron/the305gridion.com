import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import styles from "./SidebarCard.module.css";

// function SidebarCard({ title, tooltip, children, className }) {
//     return (
//         <div className={`${styles.sidebarCard} ${className || ""}`}>
//             {title && (
//                 <h3 className={styles.sidebarCardTitle}>
//                     {title}
//                     {tooltip && (
//                         <Tooltip
//                             title={tooltip}
//                             placement='top-end'
//                             className={styles.tooltipIcon}
//                         >
//                             <InfoOutlineIcon className={styles.infoIcon} />
//                         </Tooltip>
//                     )}
//                 </h3>
//             )}

//             {children}
//         </div>
//     );
// }

function SidebarCard({ children, ...props }) {
    return (
        <div className={styles.sidebarCard} {...props}>
            {children}
        </div>
    );
}

function Title({ children, className = "" }) {
    return (
        <h3 className={`${styles.sidebarCardTitle} ${className}`}>
            {children}
        </h3>
    );
}

function List({ children, className = "" }) {
    return (
        <ul className={`${styles.sidebarCardList} ${className}`}>{children}</ul>
    );
}

function ListItem({ children, className = "" }) {
    return (
        <li className={`${styles.sidebarCardListItem} ${className}`}>
            {children}
        </li>
    );
}

SidebarCard.Title = Title;
SidebarCard.List = List;
SidebarCard.ListItem = ListItem;

export default SidebarCard;
