import React, { useEffect, useState } from "react";
import { fetchChatMessages } from "../../config/chat";
import ChatBox from "./ChatBox";
import { formatTimestamp } from "../../config/utils";

export default function ChatThread({
  selectedChat,
  handleSendMessage,
  newMessage,
  setNewMessage,
}) {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = selectedChat.userId;

  useEffect(() => {
    if (selectedChat) {
      setIsLoading(true);
      const unsubscribe = fetchChatMessages(userId, (messages) => {
        setChats(messages);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col justify-between h-[calc(100vh_-_196px)]">
      <ul className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8 h-full overflow-scroll bg-gray-50">
        {chats.map((item, index) => (
          <li
            className={`bg-white px-2 py-2 shadow sm:rounded-lg ${item.user === 'admin' ? 'border-r-4 border-blue-400' : 'border-l-4 border-yellow-400'} `}
            key={index}
          >
            {item.user === "admin" ? (
              <div className="flex flex-col text-right justify-items-start items-end">
                <p className="mt-1 whitespace-nowrap text-[10px] text-gray-400">
                  <time>{formatTimestamp(item.timeStamp)}</time>
                </p>
              </div>
            ) : (
                <div className="flex flex-col sm:items-baseline">
                <p className="mt-1 whitespace-nowrap text-[10px] text-gray-400">
                  <time>{formatTimestamp(item.timeStamp)}</time>
                </p>
              </div>
            )}
            {item.user === "admin" ? (
              <div className="mt-1 space-y-6 text-sm text-gray-400 text-right">
                {item.chat}
              </div>
            ) : (
              <div className="mt-1 space-y-6 text-sm text-gray-400">
                {item.chat}
              </div>
            )}
          </li>
        ))}
      </ul>
      <ChatBox
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </div>
  );
}
