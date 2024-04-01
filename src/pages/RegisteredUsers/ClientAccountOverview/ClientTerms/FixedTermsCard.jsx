import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useModal } from '../../context/ModalContext';
import { PlusIcon } from "@heroicons/react/24/outline";
import { formatNumber } from '../../config/utils';
import LoadingScreen from '../../components/LoadingScreen';
import { getAllTerms } from '../../../../config/terms';


export default function FixedTermCards() {
  const { userId } = useParams();
    const [open, setOpen] = useState(false);
    const [fixedTerms, setFixedTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTerms, setSelectedTerm] = useState(null)

    const sortedTerms = [...fixedTerms].sort((a, b) => a.index - b.index);

    useEffect(() => {
      async function fetchTerms() {
        try {
          setIsLoading(true);
          const fetchedTerms = await getAllTerms();
          setFixedTerms(fetchedTerms);
        } catch (error) {
          console.error("Error fetching Terms:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchTerms();
    }, []);
  
    const handleInvest = (term) => {
      setSelectedTerm(term);
      setOpen(true);
    };
  
  return (
    <div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 xl:gap-x-8 w-full">
      {isLoading && <LoadingScreen />}
      {!fixedTerms || fixedTerms.length === 0 ? (
        <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4">
          <h5 className="text-gray-400 text-lg ">NO FIXED TERM DEPOSITS FOUND.</h5>
        </div>
      ) : (
        sortedTerms.map((term) => (
          <li
            key={term.index}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4 flex-col">
            <button
                  className="block text-gray-400 hover:text-indigo-500 relative ml-auto"
                  onClick={() => handleInvest(term)}
                >
                  <span className="sr-only">Open options</span>
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              <img
                src={term.imagePreview}
                alt={term.bankName}
                className="h-12 w-12 flex-none rounded-lg bg-white ring-1 ring-gray-900/10 object-contain"
              />
              <div className="text-sm font-medium leading-6 text-gray-900 pt-2">
                {term.bankName}
              </div>
            </div>
            <dl className="divide-y divide-gray-100 px-4 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Term</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{term.term}</div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Principal Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{formatNumber(term.minAmount)}</div>
                </dd>
              </div>
              <div className="col-span-1 flex shadow-sm">
                <div className="flex flex-1 items-center justify-between rounded-md truncate  bg-black mt-6">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <p className="text-white font-bold text-xl">
                      {term.interestRate}%
                    </p>
                    <p className="font-medium text-white hover:text-white">
                      Fixed Term Interest
                    </p>
                  </div>
                </div>
              </div>
            </dl>
          </li>
        ))
      )}
    </ul>
    </div>
  )
}
