import ContentCutIcon from "@mui/icons-material/ContentCut";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import season2026 from "./2026.json";

export const seasonalTransactions = [
    {
        id: 2026,
        data: season2026,
    },
];

export const transactionTypeMap = {
    release: { icon: ContentCutIcon, text: "Released" },
    addition: { icon: PersonAddIcon, text: "Signed" },
    trade_away: { icon: SwapHorizIcon, text: "Traded" },
    trade_for: { icon: SwapHorizIcon, text: "Acquired" },
    tendered: { icon: PersonAddIcon, text: "Tendered" }
};

export const sidebarCardMessaging = {
    Additions: {
        empty: "No new Dolphins yet... maybe they're still swimming in free agency waters. Check back March 11, 2026!",
        tooltip:
            "Players added from other teams in free agency or through trade.",
    },
    Resignings: {
        empty: "Nobody's re-signed yet. Don't worry, Sully and Haf haven't had their morning coffee yet, they'll get to it!",
        tooltip: "Players resigned from last year's squad.",
    },
    Losses: {
        empty: "Roster intact! No cuts, no trades... your Dolphins are still all here (for now).",
        tooltip: "Players lost to another team in free agency or via trade.",
    },
    Undrafted: {
        empty: "Undrafted free agents are lurking in the shadows... they can't join the squad until the draft ends. Patience, young grasshopper!",
        tooltip: "Players signed after the draft who did not get drafted.",
    },
    Unsigned: {
        empty: "Will they return? It's anyone's guess, but they haven't signed on the dotted line just yet.",
        tooltip:
            "Players from last year's roster whose contracts have expired.",
    },
};
