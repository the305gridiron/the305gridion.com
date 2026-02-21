import styles from "./SidebarCards.module.scss";

function SidebarCards(props) {
    return (
        <aside id={props.id} className={styles.sidebarCards}>
            {props.children}
        </aside>
    );
}

export default SidebarCards;
