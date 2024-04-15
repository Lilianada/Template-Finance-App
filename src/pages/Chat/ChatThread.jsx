import React, { Fragment, useEffect, useState } from "react";
import { fetchChatMessages } from "../../config/chat";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import ChatBox from "./ChatBox";
import { formatTimestamp } from "../../config/utils";

export default function ChatThread({
  selectedChat,
  handleCloseChat,
  handleSendMessage,
  newMessage,
  setNewMessage,
}) {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = selectedChat.userId || "69IiqbUbNaVywdRdkvoWFJDvPqq1";

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
    <div>
      {/* Thread section*/}
      <ul className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8">
        {chats.map((item, index) => (
          <li
            className={`bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6 ${item.user === 'admin' ? 'border-s-teal-700' : 'border-0'} `}
            key={index}
          >
            {item.user === "admin" ? (
              <div className="flex flex-col text-right justify-items-start items-end">
                <p className="mt-1 whitespace-nowrap text-xs text-gray-400">
                  <time>{formatTimestamp(item.timeStamp)}</time>
                </p>
                <h3 className="text-sm font-medium">
                  <span className="text-gray-900">Admin</span>
                </h3>
              </div>
            ) : (
                <div className="flex flex-col sm:items-baseline">
                <p className="mt-1 whitespace-nowrap text-xs text-gray-400">
                  <time>{formatTimestamp(item.timeStamp)}</time>
                </p>
                <h3 className="text-sm font-medium">
                <span className="text-gray-900">{item.userName}</span>
                </h3>
              </div>
            )}
            {item.user === "admin" ? (
              <div className="mt-4 space-y-6 text-sm text-gray-400 text-right">
                {item.chat}
              </div>
            ) : (
              <div className="mt-4 space-y-6 text-sm text-gray-400">
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
