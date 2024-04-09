import React from "react";
import { TrashIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const activityItems = [
  {
    userName: "John Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  {
    userName: "Julius Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "2h",
  },
  {
    userName: "Michael Denis",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  {
    userName: "John Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  {
    userName: "John Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "7h",
  },
  {
    userName: "John Hawkins",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "8h",
  },
  {
    userName: "James Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "3h",
  },
  {
    userName: "Hanks Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  {
    userName: "Jane Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
  {
    userName: "Jeus Done",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "2w",
  },
  {
    userName: "Johnson Dericoe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "23h",
  },
  {
    userName: "John Doe",
    project: "Workcation",
    commit: "2d89f0c8",
    environment: "production",
    time: "1h",
  },
];

export default function Notifications() {
  return (
    <div className=" lg:flex-shrink-0 lg:border-l lg:border-gray-200 ">
      <div className="lg:w-80">
        <div className="pb-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-left text-lg font-semibold">Notifications</h2>
            <button type="button"
              className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
               >Delete all</button>
          </div>
          <div></div>
          <ul className="divide-y divide-gray-200 bg-gray-50 p-4 sm:pr-6 lg:pr-8 xl:pr-0">
            {activityItems.map((item) => (
              <li key={item.commit} className="py-4">
                <div className="flex space-x-3">
                  <UserCircleIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{item.userName}</h3>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 text-left">
                        Deployed {item.project} ({item.commit} in master) to{" "}
                        {item.environment}
                      </p>
                      <button>
                        <TrashIcon
                          className="h-4 w-4 text-red-400"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
