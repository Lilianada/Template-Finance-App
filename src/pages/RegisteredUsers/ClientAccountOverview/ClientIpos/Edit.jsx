import React, { Fragment, useEffect, useState } from "react";
import DotLoader from "../../../../components/DotLoader";
import { formatNumber, getCurrentDate } from "../../../../config/utils";
import { customModal } from "../../../../utils/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import {
  deleteUserIpo,
  updateIposToUserCollection,
} from "../../../../config/ipos";

export default function EditUserIpos({
  setOpen,
  open,
  ipo,
  userId,
  refreshDetails,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState("");
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [type, setType] = useState("");
  const { showModal, hideModal }  = useModal();

  useEffect(() => {
    if (ipo) {
      setDate(ipo.date);
      setNumberOfShares(ipo.numberOfShares);
      setType(ipo.type);
    }
  }, [ipo]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
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
    };
    setIsLoading(true);
    try {
      await updateIposToUserCollection(userId, ipo.id, investmentData);
      customModal({
        showModal,
        title: "Success!",
        text: `You have successfully updated this investment on behalf of this user.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      setNumberOfShares(0);
      refreshDetails();
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

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this investment. This action cannot be undone.`,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonBgColor: "bg-red-600",
      confirmButtonTextColor: "text-white",
      cancelButtonBgColor: "bg-white",
      cancelButtonTextColor: "text-gray-900",
      onConfirm: () => {
        confirmDelete();
        hideModal();
      },
      onCancel: hideModal(),
      onClose: hideModal(),
      icon: ExclamationTriangleIcon,
      iconBgColor: "bg-red-100",
      iconTextColor: "text-red-600",
      timer: 0,
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUserIpo(userId, ipo.id);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully deleted an investment on behalf of this user.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      refreshDetails();
      setOpen(false);
    } catch (error) {
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error deleting this investment. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
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
                onSubmit={handleUpdate}
                className="text-left px-4 pt-10 pb-4"
              >
                <div className="space-y-6">
                  {/* IPO Information */}
                  <div>
                    <h2 className="text-xl font-semibold leading-7 text-gray-900">
                      Edit IPO Information
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
                        type="number"
                        name="numberOfShares"
                        value={numberOfShares}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="mt-8 flex space-x-6 justify-end">
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
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                      onClick={handleDelete}
                    >
                      {isDeleting ? (
                        <div className="flex w-full justify-center align-middle gap-2">
                          <span>Deleting</span>
                          <DotLoader />
                        </div>
                      ) : (
                        "Delete"
                      )}
                    </button>
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
