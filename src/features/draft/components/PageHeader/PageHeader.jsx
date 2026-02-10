import Container from "../Container/Container";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
    return (
        <header className={styles.header}>
            <Container>
                <h1 className={styles.title}>2026&nbsp;Big&nbsp;Board Coming Soon</h1>
                <p className={styles.promo}>We're still preparing for the 2026 draft, but while you wait, checkout what we had to say about last years class!</p>
            </Container>
        </header>
    );
}

export default PageHeader;