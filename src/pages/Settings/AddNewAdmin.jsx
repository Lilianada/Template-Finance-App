import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { addAdminUser, fetchAdmins } from "../../config/admin";

export default function AddNewAdmin() {
  const [email, setEmail] = useState('');
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const fetchedAdmins = await fetchAdmins();
        setAdmins(fetchedAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    getAdmins();
  }, []);


  const handleAddAdmin = async () => {
    if (!email) return; 

    try {
      await addAdminUser(email);
      setEmail('');
    } catch (error) {
      console.error('Error adding admin user:', error);
    }
  }; 
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
                onClick={handleAddAdmin}
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
            {admins.map((person) => (
              <li key={person.email} className="flex py-4">
                <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
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
