import { PageTitle, Hero } from "@/components/layout";
import { useScheduleQuery } from "@/hooks/useScheduleQuery";
import ScheduleRow from "./ScheduleRow";
import styles from "./Schedule.module.css";

export default function Schedule() {
    const { data: schedule, isLoading, isError } = useScheduleQuery();

    const preseasonGames = schedule?.filter(
        (game) => game.season_type === "PRE" && game.year === 2026,
    );
    const regularSeasonGames = schedule?.filter(
        (game) => game.season_type === "REGULAR" && game.year === 2026,
    );

    return (
        <>
            <PageTitle title='Schedule - The 305 Gridiron' />

            <div className={styles.scheduleContainer}>
                <Hero>
                    <Hero.Title>Miami Dolphins Schedule</Hero.Title>
                    <Hero.Promo>
                        Every matchup on the 2026 slate, plus our Preview and
                        Reaction videos as they go live each week.
                    </Hero.Promo>
                </Hero>

                <main className={styles.mainDashboard}>
                    {isLoading && (
                        <div className={styles.stateMessage}>
                            Loading schedule…
                        </div>
                    )}

                    {isError && (
                        <div className={styles.stateMessage}>
                            Couldn't load the schedule. Please refresh the page.
                        </div>
                    )}

                    {preseasonGames && (
                        <>
                            <h2 className={styles.sectionHeader}>
                                Preseason
                            </h2>
                            <div className={styles.scheduleList}>
                                {preseasonGames.map((game) => (
                                    <ScheduleRow key={game.id} game={game} />
                                ))}
                            </div>
                        </>
                    )}

                    {regularSeasonGames && (
                        <>
                            <h2 className={styles.sectionHeader}>
                                Regular Season
                            </h2>
                            <div className={styles.scheduleList}>
                                {regularSeasonGames.map((game) => (
                                    <ScheduleRow key={game.id} game={game} />
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}