import React, { useEffect, useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { fetchUserDocument } from "../../../config/documents";

export default function ClientDoc({ initialUser }) {
  const [doc, setDoc] = useState([]);
  const user = initialUser.id;

  const fetchDoc = async () => {
    try {
      const doc = await fetchUserDocument(user);
      setDoc(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="px-4 sm:px-0 text-left">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Documents
        </h3>
      </div>
      <div className="px-4 py-6 sm:col-span-2 sm:px-0">
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {doc.length > 0 ? (
              doc.map((doc) => (
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        {doc.fileDescription}
                      </span>
                      {/* <span className="flex-shrink-0 text-gray-400">2.4mb</span> */}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 space-x-4">
                    <button
                      type="button"
                      className="rounded-md bg-gray-50 font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Update
                    </button>
                    <span className="text-gray-200" aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      className="rounded-md bg-gray-50 font-medium text-gray-900 hover:text-gray-800"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div className="w-full grid place-items-center p-4">
                <h5 className="text-gray-400 text-lg ">No Document</h5>
              </div>
            )}
          </ul>
        </dd>
      </div>
    </div>
  );
}
