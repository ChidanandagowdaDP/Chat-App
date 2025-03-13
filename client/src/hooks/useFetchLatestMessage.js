import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    if (!chat?._id) {
      console.warn("Chat ID is undefined, skipping fetch.");
      return;
    }

    let isMounted = true; // Prevent updating state if unmounted

    const getMessages = async () => {
      try {
        const response = await getRequest(`${baseUrl}/messages/${chat._id}`);

        if (response.error) {
          console.error("Error getting message:", response.message);
          return;
        }

        const lastMessage = response[response.length - 1];

        if (isMounted) {
          setLatestMessage(lastMessage);
        }
      } catch (error) {
        console.error("Fetch latest message failed:", error);
      }
    };

    getMessages();

    return () => {
      isMounted = false; // Cleanup function to prevent state update
    };
  }, [chat?._id, newMessage, notifications]);

  return { latestMessage };
};
