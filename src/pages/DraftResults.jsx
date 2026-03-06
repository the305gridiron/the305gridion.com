import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import Hero from "../layout/Hero";
import DraftList from "../components/DraftList";
import Sidebar from "../layout/Sidebar";
import SidebarCards from "../components/SidebarCards";
import FreeAgencyPlayerCard from "../components/FreeAgencyPlayerCard";

import { draftVersions } from "../data/draft-results";
import { sidebarCardMessaging } from "../data/transactions/index";

import styles from "./DraftResults.module.css";


export default function DraftResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedYear = Number(searchParams.get("year"));

  const validVersion = draftVersions.find(
    (draft) => draft.year === requestedYear
  );

  // If invalid or missing, default to latest
  const latestDraft = [...draftVersions].sort((a, b) => b.year - a.year)[0];
  const currentDraft = validVersion || latestDraft;

  useEffect(() => {
    if (!validVersion) {
      setSearchParams({
        year: currentDraft.year,
      });
    }
  }, [validVersion, setSearchParams]);

  return (
    <div className={styles.draftResults}>
      <Hero>
        <Hero.Title>Draft Results</Hero.Title>
        <Hero.Promo>
          The picks aren't in yet, but we're gearing up to break down the results as soon as the buzzer sounds. Check back on April 23rd for all the biggest surprises, best fits, and names you need to know as they hit the league.
        </Hero.Promo>
      </Hero>

      <main className='container-fluid'>
        <DraftList players={currentDraft.data.results} />
        <Sidebar id='draftResults'>
          <SidebarCards>
            <FreeAgencyPlayerCard
              title="Signed UDFA's"
              players={currentDraft.data.udfa}
              messaging={sidebarCardMessaging.Undrafted}
            />
          </SidebarCards>
        </Sidebar>
      </main>
    </div>
  );
}
