import React from "react";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function AddNewAdmin() {
  const team = [
    {
      name: "Calvin Hawkins",
      email: "calvin.hawkins@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Bessie Richards",
      email: "bessie.richards@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Floyd Black",
      email: "floyd.black@example.com",
      imageUrl:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];
  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 sm:col-span-10 lg:px-0 text-left">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-2  px-4 py-6 sm:p-6">
          <label
            htmlFor="add-team-members"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Add Team Members
          </label>
          <p id="add-team-members-helper" className="sr-only">
            Search by email address
          </p>
          <div className="flex">
            <div className="flex-grow">
              <input
                type="text"
                name="add-team-members"
                id="add-team-members"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                placeholder="Email address"
                aria-describedby="add-team-members-helper"
              />
            </div>
            <span className="ml-3">
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PlusIcon
                  className="-ml-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                Add
              </button>
            </span>
          </div>
        </div>
        <div className="border-b border-gray-200  px-4 py-6 sm:p-6">
          <ul className="divide-y divide-gray-200">
            {team.map((person) => (
              <li key={person.email} className="flex py-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={person.imageUrl}
                  alt=""
                />
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {person.name}
                  </span>
                  <span className="text-sm text-gray-500">{person.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
