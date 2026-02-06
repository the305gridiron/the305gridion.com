import React from "react";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import styles from "./ScrollToTop.module.scss";

export default class ScrollToTop extends React.Component {
    state = {
        is_visible: false,
    };

    componentDidMount() {
        var scrollComponent = this;
        document.addEventListener("scroll", function (e) {
            scrollComponent.toggleVisibility();
        });
    }

    toggleVisibility = () =>
        this.setState({ is_visible: window.pageYOffset > 300 ? true : false });

    scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    render() {
        const { is_visible } = this.state;
        return (
            <div className={styles.scrollToTop}>
                {is_visible && (
                    <button onClick={this.scrollToTop}>
                        <KeyboardArrowUpOutlinedIcon />
                    </button>
                )}
            </div>
        );
    }
}
