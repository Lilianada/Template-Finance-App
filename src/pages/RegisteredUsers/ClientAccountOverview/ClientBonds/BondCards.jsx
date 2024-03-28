import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../config/utils";
import LoadingScreen from "../../../../components/LoadingScreen";
import { getAllBonds } from "../../../../config/bonds";
import AddUserBonds from "./Add";

export default function BondCards() {
  const { userId } = useParams();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bonds, setBonds] = useState([]);
  const [selectedBond, setSelectedBond] = useState("");

  useEffect(() => {
    async function fetchBonds() {
      try {
        setIsLoading(true);
        const fetchedBonds = await getAllBonds();
        setBonds(fetchedBonds);
      } catch (error) {
        console.error("Error fetching bonds:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBonds();
  }, []);

  const sortedBonds = [...bonds].sort((a, b) => a.index - b.index);

  const handleInvest = (bond) => {
    setSelectedBond(bond);
    setOpen(true);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 xl:gap-x-8 w-full">
        {isLoading && <LoadingScreen />}
        {!bonds || bonds.length === 0 ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4">
            <h5 className="text-gray-400 text-lg ">NO BONDS FOUND.</h5>
          </div>
        ) : (
          sortedBonds.map((bond) => (
            <li
              key={bond.index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4 flex-col">
                <button
                  className="block text-gray-400 hover:text-indigo-500 relative ml-auto"
                  onClick={() => handleInvest(bond)}
                >
                  <span className="sr-only">Open options</span>
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <img
                  src={bond.image}
                  alt={bond.issuerName}
                  className="h-12 w-12 flex-none rounded-lg bg-white ring-1 ring-gray-900/10 object-contain"
                />
                <div className="text-sm font-medium leading-6 text-gray-900 pt-2">
                  {bond.issuerName}
                </div>
              </div>
              <dl className="divide-y divide-gray-100 px-4 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">{bond.type}</div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Company Website</dt>
                  <dd className="flex items-start gap-x-2">
                    <Link
                      to={bond.companyWebsite}
                      className="font-medium text-indigo-700 cursor-pointer hover:text-indigo-400 rounded-md py-1 px-2 text-xs ring-1 ring-inset"
                    >
                      URL
                    </Link>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Sector</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">{bond.sector}</div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Maturity Date</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {bond.maturityDate}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Minimum Amount</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      ${formatNumber(bond.minimumAmount)}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">ISIN</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">{bond.isin}</div>
                  </dd>
                </div>

                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Coupon Frequency</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      {bond.couponFrequency}
                    </div>
                  </dd>
                </div>
                <div className="col-span-1 flex shadow-sm">
                  <div className="flex flex-1 items-center justify-between rounded-md truncate  bg-black mt-6">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <p className="text-white font-bold text-xl">
                        {bond.couponRate}%
                      </p>
                      <p className="font-medium text-white hover:text-white">
                        Coupon
                      </p>
                    </div>
                  </div>
                </div>
              </dl>
            </li>
          ))
        )}
        <AddUserBonds
          bond={selectedBond}
          setBond={setSelectedBond}
          open={open}
          setOpen={setOpen}
          userId={userId}
        />
      </ul>
    </div>
  );
}
