import TransactionCard from "../TransactionCard/TransactionCard";
import { IconHeader, Dropdown } from "@/components/ui";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import styles from "./TransactionList.module.css";

export default function TransactionList(props) {
    return (
        <div id='transactionList' className={styles.transactionList}>
            <header className={styles.transactionListHeader}>
                <IconHeader
                    icon={<TrendingUpOutlinedIcon />}
                    title='Transactions'
                />

                <Dropdown
                    className={styles.transactionTypeDropdown}
                    onChange={(e) => props.onTypeChange(e.target.value)}
                    options={[
                        { value: "all", label: "All Transactions" },
                        { value: "addition", label: "Added" },
                        { value: "release", label: "Released" },
                        { value: "trade", label: "Traded" },
                        { value: "restructure", label: "Restructured" },
                    ]}
                />
            </header>
            <div className={styles.transactionCards}>
                {props.players && props.players.length > 0 ? (
                    props.players.map((player) => (
                        <TransactionCard key={player.id} {...player} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>Quiet in the 305</h3>
                        <p>
                            No moves match this filter right now. Try switching
                            it up.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
