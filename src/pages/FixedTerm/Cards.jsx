import React, { Fragment, useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { PencilIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { customModal } from '../../config/modalUtils';
import { deleteIpos, deleteTerm } from '../../config/terms';
import LoadingScreen from '../../components/LoadingScreen';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Cards({fixedTerms, isLoading, handleEdit, refreshTerms}) {
    console.log(fixedTerms)
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showModal, hideModal} = useModal();
    const [selectedTerms, setSelectedTerm] = useState(null)
    const sortedTerms = [...fixedTerms].sort((a, b) => a.index - b.index);
  
    const handleDelete = () => {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete this term investment. This action cannot be undone.`,
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
        console.log(selectedTerms)
        await deleteTerm(selectedTerms);
        customModal({
          showModal,
          title: "Success",
          text: "You have successfully deleted this term.",
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
        setOpen(false);
        refreshTerms();
      } catch (error) {
        customModal({
          showModal,
          title: "Error!",
          text: "There was an error deleting this term. Please try again.",
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
      <LoadingScreen/>
    }
  
  return (
    <div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 sm:grid-cols-2 xl:gap-x-8 w-full">
      {isLoading && <LoadingScreen />}
      {!fixedTerms || fixedTerms.length === 0 ? (
        <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4">
          <h5 className="text-gray-400 text-lg ">NO BONDS FOUND.</h5>
        </div>
      ) : (
        sortedTerms.map((term) => (
          <li
            key={term.index}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4 flex-col">
              <Menu as="div" className="relative ml-auto">
                <Menu.Button
                  className="block text-gray-400 hover:text-indigo-500"
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
                          onClick={() => handleEdit(term) }
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                          )}
                        >
                          Edit<span className="sr-only">, {term.name}</span>
                        </div>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => { setSelectedTerm(term.id); handleDelete(); }}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900 w-full cursor-pointer"
                          )}
                        >
                          Delete<span className="sr-only">, {term.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
              <img
                src={term.imagePreview}
                alt={term.name}
                className="h-12 w-12 flex-none rounded-lg bg-white ring-1 ring-gray-900/10 object-contain"
              />
              <div className="text-sm font-medium leading-6 text-gray-900 pt-2">
                {term.name}
              </div>
            </div>
            {/* <dl className="divide-y divide-gray-100 px-4 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Type</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{term.type}</div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Company Website</dt>
                <dd className="flex items-start gap-x-2">
                  <Link
                    to={term.companyWebsite}
                    className="font-medium text-indigo-700 cursor-pointer hover:text-indigo-400 rounded-md py-1 px-2 text-xs ring-1 ring-inset"
                  >
                    URL
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Sector</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{term.sector}</div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Maturity Date</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">
                    {term.maturityDate}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Minimum Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">
                    ${formatNumber(term.minimumAmount)}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">ISIN</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">{term.isin}</div>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Coupon Frequency</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">
                    {term.couponFrequency}
                  </div>
                </dd>
              </div>
              <div className="col-span-1 flex shadow-sm">
                <div className="flex flex-1 items-center justify-between rounded-md truncate  bg-black mt-6">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <p className="text-white font-bold text-xl">
                      {term.couponRate}%
                    </p>
                    <p className="font-medium text-white hover:text-white">
                      Coupon
                    </p>
                  </div>
                </div>
              </div>
            </dl> */}
          </li>
        ))
      )}
    </ul>
    </div>
  )
}