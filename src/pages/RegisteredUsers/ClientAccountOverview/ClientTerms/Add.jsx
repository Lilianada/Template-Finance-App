import React, { Fragment, useState } from "react";
import { useModal } from "../../../../context/ModalContext";
import { formatNumber, getCurrentDate } from "../../../../config/utils";
import { addTermToUserCollection } from "../../../../config/terms";
import { customModal } from "../../../../config/modalUtils";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DotLoader from "../../../../components/DotLoader";
import { Dialog, Transition } from "@headlessui/react";
import CurrencyInput from "react-currency-input-field";
import { getUser } from "../../../../config/user";

export default function AddUserTerms({ setOpen, open, fixedTerm, userId }) {
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

  const onDeposit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (!fixedTerm) {
        console.error("No selected fixed term deposit.");
        return;
      }
      const user = await getUser(userId);
      const newDeposit = {
        date: getCurrentDate(),
        principalAmount: parseFloat(depositAmount),
        minAmount: fixedTerm.minAmount,
        status: "Paid",
        bankName: fixedTerm.bankName,
        term: fixedTerm.term,
        interestRate: fixedTerm.interestRate,
        type: "Deposit",
        image: fixedTerm.image,
        userId: userId,
        userName: user[0].fullName,
      };
      await addTermToUserCollection(userId, newDeposit);
      customModal({
        showModal,
        title: "Success!",
        text: `You have successfully made a deposit of $${formatNumber(
          depositAmount
        )} on behalf of this user.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      setDepositAmount(0);
      setOpen(false);
      // refreshDetails();
    } catch (error) {
      console.error("Error adding deposit transaction: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
                  onSubmit={onDeposit}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-12">
                    <div className="">
                      <h2 className="text-xl font-semibold leading-7 text-gray-900">
                        Add Fixed Term Deposit Information
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Amount can not be less than minimum investment amount.
                      </p>
                    </div>

                    <div className="pb-4">
                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                          <label
                            htmlFor="bankName"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Bank Name
                          </label>
                          <div className="text-sm leading-6 text-gray-500 font-normal">
                            {fixedTerm.bankName}
                          </div>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="term"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Length
                          </label>
                          <div className="text-sm leading-6 text-gray-500 font-normal">
                            {fixedTerm.term}
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="currentValue"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Minimum Amount
                          </label>
                          <div className="text-sm leading-6 text-gray-500 font-normal">
                            ${formatNumber(fixedTerm.minAmount)}
                          </div>
                        </div>

                        <div className="sm:col-span-full">
                          <label
                            htmlFor="fixedTermAmount"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Input Amount
                          </label>
                          <div className="mt-2">
                            <CurrencyInput
                              decimalSeparator="."
                              prefix="$"
                              name="fixedTermAmount"
                              placeholder="$0"
                              defaultValue={depositAmount}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              decimalsLimit={2}
                              onValueChange={(value) => {
                                const formattedValue =
                                  parseFloat(value).toFixed(2);
                                setDepositAmount(parseFloat(formattedValue));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-6 justify-end">
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
                          <span>Sumitting</span>
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
    </div>
  );
}
