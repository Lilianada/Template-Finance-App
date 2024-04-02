import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { customModal } from "../../../../config/modalUtils";
import LoadingScreen from "../../../../components/LoadingScreen";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../config/utils";
import {
  deleteTermFromUserCollection,
  getUserFixedTerm,
} from "../../../../config/terms";
import EditUserTerms from "./Edit";
import DotLoader from "../../../../components/DotLoader";

export default function ClientTermPage() {
  const { showModal, hideModal } = useModal();
  const [fixedTerms, setFixedTerms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const fetchedTerms = await getUserFixedTerm(userId);
      setFixedTerms(fetchedTerms);
    } catch (error) {
      console.error("Error fetching Terms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (term) => {
    setOpen(true);
    setSelectedId(term);
  };

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
      await deleteTermFromUserCollection(selectedId);
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
      //   refreshTerms();
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
    <LoadingScreen />;
  }

  return (
    <div className="px-4 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Fixed Term Deposits
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the Fixed Terms Deposits a user has made.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() =>
              navigate(
                `/dashboard/registered_users/view/view_fixed_terms/${userId}`
              )
            }
          >
            Add Deposits
          </button>
        </div>
      </div>
      {isLoading && <DotLoader />}
      <div className="-mx-4 mt-8 sm:-mx-0">
        {fixedTerms === null ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
            <h5 className="text-gray-400 text-base ">
              NO FIXED TERM DEPOSITS AVAILABLE.
            </h5>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Bank Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Term
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Principal Amount
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Interest Rate
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Purchase Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-left">
              {fixedTerms.map((term, index) => (
                <tr key={index}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none capitalize sm:pl-0">
                    {term.bankName}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only lg:hidden">Type</dt>
                      <dd className="mt-1 text-gray-700 capitalize">
                        {term.type}
                      </dd>
                      <dt className="sr-only">Interest Rate</dt>
                      <dd className="mt-1 text-gray-700 sm:hidden">
                        {term.interestRate}%
                      </dd>
                      <dt className="sr-only sm:hidden">Purchase Date</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {term.date}
                      </dd>
                    </dl>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {term.term}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    $ {formatNumber(term.principalAmount)}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 capitalize lg:table-cell">
                    {term.type}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {term.interestRate}%
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {term.date}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEdit(term)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(term.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {open && (
          <EditUserTerms
            userId={userId}
            fixedTerm={selectedId}
            setFixedTerms={setSelectedId}
            open={open}
            setOpen={setOpen}
            refreshDetails={fetchTerms}
          />
        )}
      </div>
    </div>
  );
}
