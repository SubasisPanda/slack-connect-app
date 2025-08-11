// backend/src/slackApi.ts
import axios from "axios";

export async function fetchChannels(accessToken: string) {
  const response = await axios.get("https://slack.com/api/conversations.list", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
}

export async function postMessage(accessToken: string, channel: string, text: string) {
  const response = await axios.post(
    "https://slack.com/api/chat.postMessage",
    { channel, text },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
}
