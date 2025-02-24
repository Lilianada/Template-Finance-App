import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingScreen from "../../components/LoadingScreen";
import { customModal } from "../../utils/modalUtils";
import { deleteIpos } from "../../config/ipos";
import { useModal } from "../../context/ModalContext";
import { formatNumber } from "../../config/utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Cards({ ipos, isLoading, handleEdit, refreshIpos }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal, hideModal } = useModal();
  const [selectedIpos, setSelectedIpos] = useState(null);
  
  const sortedIpos = [...ipos].sort((a, b) => a.index - b.index);

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this ipos investment. This action cannot be undone.`,
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
      console.log(selectedIpos);
      await deleteIpos(selectedIpos);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully deleted this ipos.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      refreshIpos();
      setOpen(!open);
    } catch (error) {
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error deleting this ipos. Please try again.",
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

  if (isDeleting) {
    <LoadingScreen />;
  }

  return (
    <div className="">
      {isLoading && <LoadingScreen />}
      {!ipos || ipos.length === 0 ? (
        <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mx-auto">
          <h5 className="text-gray-400 text-lg ">NO IPOS FOUND.</h5>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 xl:gap-x-8 w-full">
          {sortedIpos.map((ipos) => (
            <li
              key={ipos.index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4 flex-col">
                <Menu as="div" className="relative ml-auto">
                  <Menu.Button
                    className="block text-gray-400 hover:text-teal-500"
                    onClick={() => setOpen(true)}
                  >
                    <span className="sr-only">Open options</span>
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() => handleEdit(ipos)}
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                            )}
                          >
                            Edit<span className="sr-only">, {ipos.name}</span>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              setSelectedIpos(ipos.id);
                              handleDelete();
                            }}
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900 w-full cursor-pointer text-left"
                            )}
                          >
                            Delete<span className="sr-only">, {ipos.name}</span>
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
                      ${formatNumber(ipos.preSharePrice)}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Minimum Investment</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      ${formatNumber(ipos.minInvestment)}
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Pre Allocation</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      ${formatNumber(ipos.preAllocation)}
                    </div>
                  </dd>
                </div>

                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Share Price</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="font-medium text-gray-900">
                      ${formatNumber(ipos.sharePrice)}
                    </div>
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
