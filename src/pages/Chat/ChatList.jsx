import React from "react";
import { formatTimestamp } from "../../config/utils";

export default function ChatList({ handleChatSelection, chats }) {
  return (
    <aside className=" order-first block flex-shrink-0">
      <div className="relative flex h-full w-20 sm:w-40 lg:w-96 flex-col border-r border-gray-200 bg-gray-100">
        <div className="flex-shrink-0 border-b">
          <div className="flex h-16 flex-col justify-center bg-white pr-4">
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
                className="relative bg-white pl-3 pr-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
              >
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() =>
                        handleChatSelection(user.userId, user.userName)
                      }
                      className="block focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
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
                <div className="mt-1">
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {user.preview}
                  </p>
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
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() =>
                        handleChatSelection(user.userId, user.userName)
                      }
                      className="block focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.userName}
                      </p>
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <time
                    dateTime={user.datetime}
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                  >
                    {user.date}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
