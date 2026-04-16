import styles from "./Hero.module.css";

function Hero({ children, ...props }) {
    return (
        <div className={styles.hero} {...props}>
            <div className='container'>{children}</div>
        </div>
    );
}

function Title({ children, className = "" }) {
    return <h1 className={`${styles.title} ${className}`}>{children}</h1>;
}

function Promo({ children, className = "" }) {
    return <div className={`${styles.promo} ${className}`}>{children}</div>;
}

Hero.Title = Title;
Hero.Promo = Promo;

export default Hero;
