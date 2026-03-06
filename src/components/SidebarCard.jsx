import styles from "./SidebarCard.module.css";

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
