// frontend/src/components/MessageForm.tsx
import React, { useEffect, useState } from "react";
import API from "../api";
import dayjs from "dayjs";

interface Channel {
  id: string;
  name: string;
}

interface Props {
  teamId: string;
}

const MessageForm: React.FC<Props> = ({ teamId }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channel, setChannel] = useState("");
  const [text, setText] = useState("");
  const [sendAt, setSendAt] = useState("");

  useEffect(() => {
    API.get(`/channels?team_id=${teamId}`).then(res => {
      setChannels(res.data.channels);
    });
  }, [teamId]);

  const sendNow = () => {
    API.post("/message/send", { team_id: teamId, channel, text }).then(() => {
      alert("Message sent!");
    });
  };

  const scheduleMessage = () => {
    API.post("/message/schedule", {
      team_id: teamId,
      channel,
      text,
      send_at: sendAt
    }).then(() => {
      alert("Message scheduled!");
    });
  };

  return (
    <div>
      <h3>Send Message</h3>
      <select value={channel} onChange={e => setChannel(e.target.value)}>
        <option value="">Select channel</option>
        {channels.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type your message" />
      <div>
        <button onClick={sendNow}>Send Now</button>
      </div>
      <div>
        <input
          type="datetime-local"
          value={sendAt}
          onChange={e => setSendAt(e.target.value)}
        />
        <button onClick={scheduleMessage}>Schedule</button>
      </div>
    </div>
  );
};

export default MessageForm;
