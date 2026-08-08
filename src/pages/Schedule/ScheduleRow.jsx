import { useState } from "react";
import { MapPin, Play, X } from "lucide-react";
import {
    formatGameDateShort,
    formatGameTime,
    getMatchupLabel,
    getYouTubeEmbedUrl,
    formatScoreLine,
    formatLocationLine,
} from "./scheduleConfig";
import styles from "./Schedule.module.css";

export default function ScheduleRow({ game }) {
    // activeVideo: null | "preview" | "reaction" — drives open/closed state
    // and whether the iframe is actually live (so audio stops the instant
    // you close it, rather than playing on quietly behind the animation).
    const [activeVideo, setActiveVideo] = useState(null);
    // displayVideo: mirrors activeVideo when opening, but is intentionally
    // NOT cleared when closing — it's cleared only once the slide-closed
    // transition finishes. This keeps the panel's content (and therefore
    // its height) in the DOM throughout the close animation, which is what
    // the grid-template-rows transition needs in order to animate smoothly
    // instead of snapping shut.
    const [displayVideo, setDisplayVideo] = useState(null);
    const [logoFailed, setLogoFailed] = useState(false);

    const {
        week,
        game_date,
        location_details: location,
        location_type,
        preview_video_url,
        reaction_video_url,
        dolphins_score,
        opponents_score,
        result,
        opponent_details: opponent,
        is_bye_week
    } = game;

    if (is_bye_week) {
        return (
            <div className={`${styles.gameRow} ${styles.byeRow}`}>
                <div className={`${styles.rowMain} ${styles.byeRowMain}`}>
                    <div className={styles.logoCol}>
                        {opponent?.logo ? (
                            <img
                                src={opponent.logo}
                                alt={opponent.full_name || "Miami Dolphins"}
                                className={styles.teamLogoLg}
                            />
                        ) : (
                            <div className={styles.logoFallback}>MIA</div>
                        )}
                    </div>
                    <div className={styles.byeTextGroup}>
                        <span className={styles.byeBig}>BYE</span>
                        <span className={styles.byeSubtext}>
                            Enjoy the break
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    const showLogo = opponent?.logo && !logoFailed;
    const isHome = location_type === "HOME";

    const activeUrl =
        displayVideo === "preview"
            ? preview_video_url
            : displayVideo === "reaction"
              ? reaction_video_url
              : null;
    const embedUrl = getYouTubeEmbedUrl(activeUrl);

    const toggleVideo = (key, url) => {
        if (!url) return;
        setActiveVideo((current) => {
            const next = current === key ? null : key;
            if (next) setDisplayVideo(next);
            return next;
        });
    };

    const closeVideo = () => setActiveVideo(null);

    // Once the panel finishes animating shut, drop the content entirely.
    const handlePanelTransitionEnd = (event) => {
        if (event.target !== event.currentTarget) return;
        if (event.propertyName !== "grid-template-rows") return;
        if (!activeVideo) setDisplayVideo(null);
    };

    return (
        <div
            className={`${styles.gameRow} ${isHome ? styles.gameRowHome : styles.gameRowAway}`}
        >
            <div className={styles.rowMain}>
                <div className={styles.logoCol}>
                    {showLogo ? (
                        <img
                            src={opponent.logo}
                            alt={opponent.full_name}
                            className={styles.teamLogoLg}
                            onError={() => setLogoFailed(true)}
                        />
                    ) : (
                        <div className={styles.logoFallback}>
                            {opponent?.abbr || "?"}
                        </div>
                    )}
                </div>

                <div className={styles.infoCol}>
                    <div className={styles.dateTimeGroup}>
                        <div className={styles.dateBig}>
                            {result
                                ? formatScoreLine(result, dolphins_score, opponents_score)
                                : formatGameDateShort(game_date)}
                        </div>
                        <div className={styles.weekTimeLine}>
                            {result ? (
                                <>
                                    WK{week} | {formatGameDateShort(game_date)}{" "}
                                    | {formatGameTime(game_date) || "TIME TBD"}
                                </>
                            ) : (
                                <>
                                    WK{week} |{" "}
                                    {formatGameTime(game_date) || "TIME TBD"}
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles.matchupGroup}>
                        <div className={styles.matchupSub}>
                            {getMatchupLabel(location_type)}{" "}
                            {opponent?.full_name || "Opponent TBD"}
                        </div>
                        {location && (
                            <div className={styles.locLine}>
                                <MapPin size={11} />
                                {formatLocationLine(location)}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.actionsCol}>
                    <button
                        type='button'
                        className={`${styles.videoPillBtn} ${
                            activeVideo === "preview"
                                ? styles.videoPillBtnActive
                                : ""
                        }`}
                        onClick={() => toggleVideo("preview", preview_video_url)}
                        disabled={!preview_video_url}
                    >
                        <Play size={16} fill='currentColor' />
                        Preview
                    </button>
                    <button
                        type='button'
                        className={`${styles.videoPillBtn} ${
                            activeVideo === "reaction"
                                ? styles.videoPillBtnActive
                                : ""
                        }`}
                        onClick={() =>
                            toggleVideo("reaction", reaction_video_url)
                        }
                        disabled={!reaction_video_url}
                    >
                        <Play size={16} fill='currentColor' />
                        Reaction
                    </button>
                </div>
            </div>

            <div
                className={`${styles.panelWrap} ${activeVideo ? styles.panelWrapOpen : ""}`}
                onTransitionEnd={handlePanelTransitionEnd}
            >
                <div className={styles.panelInner}>
                    {displayVideo && (
                        <div className={styles.panelContent}>
                            <div className={styles.panelHeader}>
                                <span className={styles.panelTitle}>
                                    {displayVideo === "preview"
                                        ? "PREVIEW"
                                        : "REACTION"}
                                </span>
                                <button
                                    type='button'
                                    className={styles.panelCloseBtn}
                                    onClick={closeVideo}
                                    aria-label='Close video'
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {activeVideo && embedUrl && (
                                <div className={styles.videoFrameLarge}>
                                    <iframe
                                        src={`${embedUrl}?autoplay=1`}
                                        title={
                                            displayVideo === "preview"
                                                ? "Preview video"
                                                : "Reaction video"
                                        }
                                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                        allowFullScreen
                                    />
                                </div>
                            )}
                            {activeVideo && !embedUrl && (
                                <div className={styles.videoError}>
                                    Couldn't load this video — the URL
                                    doesn't look like a valid YouTube link.
                                </div>
                            )}
                            {!activeVideo && (
                                <div
                                    className={styles.videoFrameLarge}
                                    aria-hidden='true'
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}