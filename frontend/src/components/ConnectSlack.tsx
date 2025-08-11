// frontend/src/components/ConnectSlack.tsx
import React from "react";

const ConnectSlack: React.FC = () => {
  const handleConnect = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/slack`;
  };

  return (
    <div>
      <button onClick={handleConnect}>
        Connect Slack
      </button>
    </div>
  );
};

export default ConnectSlack;
