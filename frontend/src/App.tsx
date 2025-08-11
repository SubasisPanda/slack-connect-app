// frontend/src/App.tsx
import React, { useEffect, useState } from "react";
import ConnectSlack from "./components/ConnectSlack";
import MessageForm from "./components/MessageForm";
import ScheduledList from "./components/ScheduledList";

const App: React.FC = () => {
  const [teamId, setTeamId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamParam = params.get("team_id");

    if (teamParam) {
      localStorage.setItem("team_id", teamParam);
      setTeamId(teamParam);
      window.history.replaceState({}, document.title, "/");
    } else {
      const savedId = localStorage.getItem("team_id");
      if (savedId) setTeamId(savedId);
    }
  }, []);

  return (
    <div>
      <h1>Slack Connect App</h1>
      {!teamId ? (
        <ConnectSlack />
      ) : (
        <>
          <MessageForm teamId={teamId} />
          <ScheduledList teamId={teamId} />
        </>
      )}
    </div>
  );
};

export default App;
