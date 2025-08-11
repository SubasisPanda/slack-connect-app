// frontend/src/components/ScheduledList.tsx
import React, { useEffect, useState } from "react";
import API from "../api";
import dayjs from "dayjs";

interface ScheduledMessage {
  id: number;
  team_id: string;
  channel: string;
  text: string;
  send_at: number;
  sent: number;
}

interface Props {
  teamId: string;
}

const ScheduledList: React.FC<Props> = ({ teamId }) => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);

  const fetchMessages = () => {
    API.get(`/message/scheduled?team_id=${teamId}`).then(res => {
      setMessages(res.data.scheduled);
    });
  };

  const cancelMessage = (id: number) => {
    API.delete(`/message/cancel/${id}`).then(() => {
      alert("Message canceled");
      fetchMessages();
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h3>Scheduled Messages</h3>
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            {msg.text} - {dayjs.unix(msg.send_at).format("YYYY-MM-DD HH:mm")}
            <button onClick={() => cancelMessage(msg.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduledList;
