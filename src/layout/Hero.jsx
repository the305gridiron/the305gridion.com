import styles from "./Hero.module.css";

function Hero({ children, ...props }) {
    return (
        <div className={styles.hero}>
            <div className='container'>{children}</div>
        </div>
    );
}

function Title({ children, className = "" }) {
    return (
        <h1 className={`${styles.title} ${className}`}>
            {children}
        </h1>
    );
}

function Promo({ children, className = "" }) {
    return (
        <p className={`${styles.promo} ${className}`}>{children}</p>
    );
}

Hero.Title = Title;
Hero.Promo = Promo;

export default Hero;