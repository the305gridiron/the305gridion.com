import Container from "../Container/Container";
import styles from "./PageHeader.module.css";

const PageHeader = () => {
    const getDaysUntilDraft = () => {
        const today = new Date();
        const draftDate = new Date("2026-04-23"); // Draft start date
        const diffTime = draftDate - today; // difference in milliseconds
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days
        return diffDays > 0 ? diffDays : 0;
    };

    const daysAwayFromDraft = getDaysUntilDraft();

    return (
        <header className={styles.header}>
            <Container>
                <h1 className={styles.title}>Top 150 Prospects - 2026 Draft Board</h1>
                <p className={styles.promo}>The draft is just <strong>{daysAwayFromDraft} {daysAwayFromDraft === 1 ? "day" : "days"}</strong> away! Explore the board and see which prospects would be the best fit for our Phins.</p>
            </Container>
        </header>
    );
}

export default PageHeader;