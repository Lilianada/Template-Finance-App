import React, { Fragment, useState } from "react";
import DotLoader from "../../../../components/DotLoader";
import { formatNumber } from "../../../../config/utils";
import { customModal } from "../../../../utils/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CurrencyInput from "react-currency-input-field";
import { addBondUser } from "../../../../config/bonds";
import { Dialog, Transition } from "@headlessui/react";
import { getUser } from "../../../../config/user";

export default function AddUserBonds({ setOpen, open, bond, setBond, userId }) {
  const [bondAmount, setBondAmount] = useState(0);
  const [typeOfRequest, setTypeOfRequest] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showModal } = useModal();

  const handleBuyBonds = async (event) => {
    event.preventDefault();

    const minimumInvestmentAmount = bond.minimumAmount;

    // Calculate how many bonds the user is buying
    const amountAsNumber = parseFloat(bondAmount);
    const numberOfBondsBought = amountAsNumber / minimumInvestmentAmount;

    const user = await getUser(userId);

    // Create bond data
    const bondData = {
      amountRequested: amountAsNumber,
      image: bond.image,
      type: bond.type,
      couponRate: bond.couponRate,
      companyWebsite: bond.companyWebsite,
      isin: bond.isin,
      maturityDate: bond.maturityDate,
      date: date,
      currentValue: amountAsNumber,
      issuerName: bond.issuerName,
      sector: bond.sector,
      couponFrequency: bond.couponFrequency,
      minimumAmount: bond.minimumAmount,
      typeOfRequest: typeOfRequest,
      quantity: numberOfBondsBought,
      userId: userId,
      userName: user[0].fullName,
    };
    setIsLoading(true);
    try {
      const result = await addBondUser(userId, bondData);
        
      if (result.success) {
        customModal({
          showModal,
          title: "Success",
          text: "You have successfully made an investment on behalf of this user.",
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
      }
      setOpen(false);
      setBondAmount(0);
      setTypeOfRequest("");
      setDate("");
    } catch (error) {
      console.error(error.message);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error making your investment. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      const parts = value.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      setBond((prevFormData) => ({
        ...prevFormData,
        [name]: formattedDate,
      }));
    } else {
      setBond((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
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

              <form
                className="text-left px-4 pt-10 pb-4"
                onSubmit={handleBuyBonds}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <div className="">
                    <h2 className="text-xl font-semibold leading-7 text-gray-900">
                      Add Bond Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Add purchase date and amount. Amount can not be less than
                      minimum investment amount.
                    </p>
                  </div>

                  <div className="pb-2">
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="issuerName"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Issuer Name
                        </label>
                        <div className="text-sm leading-6 text-gray-500 font-normal">
                          {bond.issuerName}
                        </div>
                      </div>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="sector"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Sector
                        </label>
                        <div className="text-sm leading-6 text-gray-500 font-normal">
                          {bond.sector}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="currentValue"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Minimum Investment Amount
                        </label>
                        <div className="text-sm leading-6 text-gray-500 font-normal">
                          ${formatNumber(bond.minimumAmount)}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="bondAmount"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Amount to be purchased
                        </label>
                        <div className="mt-2">
                          <CurrencyInput
                            decimalSeparator="."
                            prefix="$"
                            name="bondAmount"
                            placeholder="$0"
                            defaultValue={bondAmount}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            decimalsLimit={2}
                            onValueChange={(value) => {
                              const formattedValue =
                                parseFloat(value).toFixed(2);
                              setBondAmount(parseFloat(formattedValue)); // Store as a number
                            }}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="typeOfRequest"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Bonds Type
                        </label>
                        <div className="mt-2">
                          <select
                            name="typeOfRequest"
                            value={typeOfRequest}
                            onChange={(e) => setTypeOfRequest(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Type </option>
                            <option value="buy">Buy</option>
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-6 justify-end">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                  >
                    {isLoading ? (
                      <div className="flex w-full justify-center align-middle gap-2">
                        <span>Submitting</span>
                        <DotLoader />
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
