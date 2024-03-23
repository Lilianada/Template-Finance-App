import React, { Fragment, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DotLoader from "../../../../components/DotLoader";
import { convertDateToISO, getCurrentDate } from "../../../../config/utils";
import { customModal } from "../../../../config/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import CurrencyInput from "react-currency-input-field";
import { addBondUser } from "../../../../config/bonds";
import { Dialog, Transition } from "@headlessui/react";

export default function AddUserBonds({ setOpen, open, bond }) {
  const { userId } = useParams();
  const [bondAmount, setBondAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, hideModal } = useModal();

  const handleBuyBonds = async () => {
    const minimumInvestmentAmount = bond.minimumAmount;

    // Calculate how many bonds the user is buying
    const amountAsNumber = parseFloat(bondAmount);
    const numberOfBondsBought = amountAsNumber / minimumInvestmentAmount;

    // Create bond data
    const bondData = {
      amountRequested: amountAsNumber,
      image: bond.image,
      type: bond.type,
      couponRate: bond.couponRate,
      companyWebsite: bond.companyWebsite,
      isin: bond.isin,
      maturityDate: bond.maturityDate,
      purchaseDate: getCurrentDate(),
      currentValue: amountAsNumber,
      issuerName: bond.issuerName,
      sector: bond.sector,
      couponFrequency: bond.couponFrequency,
      minimumAmount: bond.minimumAmount,
      typeOfRequest: "buy",
      quantity: numberOfBondsBought,
    };
    setIsLoading(true);
    try {
      const result = await addBondUser(userId.userId, bondData);
    //   const bondId = result.id;
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
      setBondAmount(0);
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
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setBond({ ...bond, [name]: formattedDate });
    } else {
      // For all other fields
      setBond({ ...bond, [name]: value });
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

          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <button
                type="button"
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <form
                className="text-left bg-gray-50 px-6 py-8"
                onSubmit={handleBuyBonds}
              >
                <div className="space-y-12">
                  <div className="">
                    <h2 className="text-xl font-semibold leading-7 text-gray-900">
                      Add Bond Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      If you wish to remove any information, please do so below
                      by updating the field to "Nil" or "N/A." Any fields left
                      blank will not be updated as the current data will be
                      retained.
                    </p>
                  </div>

                  <div className="pb-12">
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="issuerName"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Issuer Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="issuerName"
                            id="issuerName"
                            onChange={handleChange}
                            value={bond.issuerName}
                            autoComplete="issuerName"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="currentValue"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Current Value
                        </label>
                        <div className="mt-2">
                          <CurrencyInput
                            decimalSeparator="."
                            prefix="$"
                            name="amount"
                            placeholder="0"
                            defaultValue={0}
                            decimalsLimit={2}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onValueChange={(value) => {
                              setBond((prevState) => ({
                                ...prevState,
                                amount: value,
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantity
                        </label>
                        <div className="mt-2">
                          <input
                            id="quantity"
                            name="quantity"
                            type="text"
                            onChange={handleChange}
                            value={bond.quantity || ""}
                            required
                            autoComplete="quantity"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 capitalize"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="purchaseDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Purchase Date
                        </label>
                        <div className="mt-2">
                          <input
                            type="purchaseDate"
                            name="purchaseDate"
                            id="purchaseDate"
                            onChange={handleChange}
                            value={
                              bond.purchaseDate
                                ? convertDateToISO(bond.purchaseDate)
                                : ""
                            }
                            autoComplete="date"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="maturityDate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Maturity Date
                        </label>
                        <div className="mt-2">
                          <input
                            type="maturityDate"
                            name="maturityDate"
                            id="maturityDate"
                            onChange={handleChange}
                            value={
                              bond.maturityDate
                                ? convertDateToISO(bond.maturityDate)
                                : ""
                            }
                            autoComplete="maturityDate"
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
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => window.history.back()}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                  >
                    {isLoading ? `Submitting ${(<DotLoader />)}` : "Submit"}
                  </button>
                </div>
              </form>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleBuyBonds}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Submitting</span>
                      <DotLoader />
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
