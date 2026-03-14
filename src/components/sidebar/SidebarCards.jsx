import styles from "./SidebarCards.module.css";

function SidebarCards(props) {
    return (
        <aside id={props.id} className={styles.sidebarCards}>
            {props.children}
        </aside>
    );
}

export default SidebarCards;
