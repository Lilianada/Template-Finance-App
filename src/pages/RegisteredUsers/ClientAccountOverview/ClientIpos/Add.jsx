import React, { Fragment, useState } from "react";
import { formatNumber, getCurrentDate } from "../../../../config/utils";
import { customModal } from "../../../../utils/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { addIposToUserCollection } from "../../../../config/ipos";
import { getUser } from "../../../../config/user";

export default function AddUserIpos({ setOpen, open, ipo, userId }) {
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfShares, setNumberOfShares] = useState(0);
    const [type, setType] = useState(ipo.type);
    const { showModal }  = useModal();
    const [date, setDate] = useState(getCurrentDate());
  
    const handleInvestInIpo = async (e) => {
      e.preventDefault();
      const user = await getUser(userId);
      const investmentData = {
        logo: ipo.logo,
        name: ipo.name,
        expectedDate: ipo.expectedDate,
        sharePrice: ipo.sharePrice,
        expListingPrice: ipo.expListingPrice,
        date: date,
        minInvestment: ipo.minInvestment,
        numberOfShares: numberOfShares,
        type: type,
        userId: userId,
        userName: user[0].fullName,
      };
      setIsLoading(true);
      try {
        await addIposToUserCollection(userId, investmentData);
        customModal({
            showModal,
          title: "Success!",
          text: `You have successfully made an investment on behalf of this user.`,
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
        setNumberOfShares(0);
        setOpen(false);
      } catch (error) {
        customModal({
            showModal,
          title: "Error!",
          text: `There was an issue sending your request. Please try again later.`,
          showConfirmButton: false,
          icon: ExclamationTriangleIcon,
          iconBgColor: "bg-red-100",
          iconTextColor: "text-red-600",
          buttonBgColor: "bg-red-600",
          timer: 2000,
        });
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
        <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
  
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
  
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <button
                  type="button"
                  className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
  
              <form onSubmit={handleInvestInIpo}   className="text-left px-4 pt-10 pb-4">
                <div className="space-y-6">
                  {/* IPO Information */}
                  <div>
                    <h2 className="text-xl font-semibold leading-7 text-gray-900">
                      Add IPO Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Add purchase date and amount. Amount can not be less than
                      minimum investment amount.
                    </p>
                  </div>
  
                  {/* IPO Details */}
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-900">
                        Company Name
                      </label>
                      <div className="mt-1 text-sm text-gray-500">
                        {ipo.name}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-900">
                        IPO Expected Date
                      </label>
                      <div className="mt-1 text-sm text-gray-500">
                        {ipo.expectedDate}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-900">
                        IPO Share Price
                      </label>
                      <div className="mt-1 text-sm text-gray-500">
                        ${formatNumber(ipo.sharePrice)}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Minimum Investment
                      </label>
                      <div className="mt-1 text-sm text-gray-500">
                        ${formatNumber(ipo.minInvestment)}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-900">
                        Total Cost
                      </label>
                      <div className="mt-1 text-sm text-gray-500">
                        ${formatNumber(ipo.sharePrice * numberOfShares)}
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-medium text-gray-900">
                        Number of Shares
                      </label>
                      <input
                        name="numberOfShares"
                        placeholder="0"
                        value={numberOfShares}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                      
                        onChange={(e) => setNumberOfShares(e.target.value)}
                       
                      />
                    </div>
                    
                    <div className="sm:col-span-3">
                        <label
                          htmlFor="type"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          IPOs Type
                        </label>
                        <div className="mt-2">
                          <select
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          >
                            <option value="">Select Type </option>
                            <option value="invest">Invest</option>
                            <option value="sell">Sell</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Purchase/Sale Date
                        </label>
                        <div className="mt-2">
                          <input
                            type="date"
                            name="date"
                            id="date"
                            onChange={(e) => setDate(e.target.value)}
                            value={date}
                            autoComplete="date"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                  </div>
  
                  {/* Form Actions */}
                  <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 focus-visible:ring-opacity-50"
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }