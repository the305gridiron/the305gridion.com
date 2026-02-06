import Container from "../Container/Container";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
    return (
        <header className={styles.header}>
            <Container>
                <h1 className={styles.title}>Phins Forecast 2025&nbsp;Big&nbsp;Board</h1>
            </Container>
        </header>
    );
}

export default PageHeader;