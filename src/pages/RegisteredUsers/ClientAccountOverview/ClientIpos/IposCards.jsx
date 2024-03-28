import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllIpos } from "../../../../config/ipos";
import AddUserIpos from "./Add";
import LoadingScreen from "../../../../components/LoadingScreen";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function IposCards() {
  const { userId } = useParams();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ipos, setIpos] = useState([]);
  const [selectedIpo, setSelectedIpo] = useState("");

  useEffect(() => {
    async function fetchIpos() {
      try {
        setIsLoading(true);
        const fetchedIpos = await getAllIpos();
        setIpos(fetchedIpos);
        console.log('fetched ipos', fetchedIpos)
      } catch (error) {
        console.error("Error fetching Ipos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchIpos();
  }, []);

  const handleInvest = (ipo) => {
    setSelectedIpo(ipo);
    setOpen(true);
  };

  const sortedIpos = [...ipos].sort((a, b) => a.index - b.index);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 xl:gap-x-8 w-full">
        {isLoading && <LoadingScreen />}
        {!ipos || ipos.length === 0 ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4">
            <h5 className="text-gray-400 text-lg ">NO IPOS FOUND.</h5>
          </div>
        ) : (
          sortedIpos.map((ipo) => (
            <li
              key={ipo.index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4 flex-col">
                <button
                  className="block text-gray-400 hover:text-indigo-500 relative ml-auto"
                  onClick={() => handleInvest(ipo)}
                >
                  <span className="sr-only">Open options</span>
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <img
                  src={ipos.imagePreview}
                  alt={ipos.name}
                  className="h-12 w-12 flex-none rounded-lg bg-white ring-1 ring-gray-900/10 object-contain"
                />
                <div className="text-sm font-medium leading-6 text-gray-900 pt-2">
                  {ipos.name}
                </div>
              </div>
              <dl className="divide-y divide-gray-100 px-4 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500 truncate">{ipos.description}</dt>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Expected IPO Date</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {ipos.expectedDate}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Pre-IPO Share Price</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {ipos.preSharePrice}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Minimum Investment</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {ipos.minInvestment}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Pre Allocation</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {ipos.preAllocation}
                    </div>
                  </dd>
                </div>

                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Share Price</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {ipos.sharePrice}
                    </div>
                  </dd>
                </div>
              </dl>
            </li>
          ))
        )}
        {/* <AddUserIpos
          ipo={selectedIpo}
          setIpo={setSelectedIpo}
          open={open}
          setOpen={setOpen}
          userId={userId}
        /> */}
      </ul>
    </div>
  );
}
