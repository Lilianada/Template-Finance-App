import React from "react";
import { formatTimestamp } from "../../config/utils";

export default function ChatList({ handleChatSelection, chats }) {
  return (
    <aside className=" order-first block flex-shrink-0">
      <div className="relative flex h-full w-full sm:w-60 lg:w-96 flex-col border-r border-l border-gray-200 bg-gray-100">
        <div className="flex-shrink-0 border-b">
          <div className="flex h-16 flex-col justify-center bg-white px-2 sm:px-4">
            {/* message header */}
            <div className="flex items-baseline space-x-3">
              <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
            </div>
          </div>
        </div>

        <nav
          aria-label="Message list"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <ul className="hidden lg:block divide-y divide-gray-200 border-b border-gray-200">
            {chats.map((user, index) => (
              <li
                title="Click to view chat"
                key={index}
                className="relative bg-white px-2 sm:pl-3 sm:pr-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1 truncate">
                    <button
                      onClick={() =>
                        handleChatSelection(user.userId, user.userName)
                      }
                      className="block focus:outline-none"
                    >
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.userName}
                      </p>
                    </button>
                  </div>
                  <time
                    dateTime={formatTimestamp(user.timeStamp)}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                  >
                    {formatTimestamp(user.timeStamp)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
          <ul className="block lg:hidden divide-y divide-gray-200 border-b border-gray-200">
            {chats.map((user, index) => (
              <li
                key={index}
                className="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1 truncate">
                    <button
                      onClick={() =>
                        handleChatSelection(user.userId, user.userName)
                      }
                      className="block focus:outline-none"
                    >
                      <p className=" text-sm font-medium text-gray-900">
                        {user.userName}
                      </p>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
