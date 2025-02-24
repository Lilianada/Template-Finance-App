import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatNumber } from "../../../../config/utils";
import { useModal } from "../../../../context/ModalContext";
import { customModal } from "../../../../utils/modalUtils";
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import LoadingScreen from "../../../../components/LoadingScreen";
import {
  deleteCashDeposit,
  getUserCashDeposits,
} from "../../../../config/cashBalance";
import DotLoader from "../../../../components/DotLoader";

export default function ClientCashPage() {
  const { showModal, hideModal } = useModal();
  const [cashTransaction, setCashTransaction] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchTransaction = async () => {
    setIsLoading(true);
    try {
      const result = await getUserCashDeposits(userId);
      setCashTransaction(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleEdit = async (id) => {
    navigate(`/dashboard/registered_users/view/edit_cash_details/${userId}`, {
      state: { details: id },
    });
  };

  const handleDelete = (id) => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this cash transaction. This action cannot be undone.`,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonBgColor: "bg-red-600",
      confirmButtonTextColor: "text-white",
      cancelButtonBgColor: "bg-white",
      cancelButtonTextColor: "text-gray-900",
      onConfirm: () => {
        confirmDelete(id);
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

  const confirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteCashDeposit(userId, id);
      customModal({
        showModal,
        title: "Success!",
        text: `The cash transaction has been deleted successfully.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
      fetchTransaction();
    } catch (error) {
      console.error("Failed to delete user:", error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error deleting the user. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
        onClose: hideModal,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="">
    <div className="sm:flex-auto text-left mt-4 mb-6">
      <button
        className="flex gap-2 items-center cursor-pointer"
        onClick={() => window.history.back()}
      >
        <ArrowLeftIcon className="h-5 w-5 stroke-gray-400 stroke-2" />
        <p className="text-sm text-gray-400 font-semibold">Back</p>
      </button>
    </div>
          {isLoading && <DotLoader />}
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 rounded-lg">
      <div className="sm:flex sm:items-start">
        <div className="sm:flex-auto text-left">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Cash Deposits
            </h1>
          <p className="mt-2 text-sm text-gray-700">
            All cash deposits and balances deposited into client's account.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            onClick={() =>
              navigate(
                `/dashboard/registered_users/view/add_cash_details/${userId}`
              )
            }
          >
            Add transaction
          </button>
        </div>
      </div>
      {isDeleting && <LoadingScreen />}
      <div className="-mx-4 mt-8 sm:-mx-0">
        {cashTransaction === null ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
            <h5 className="text-gray-400 text-base ">
              NO CASH TRANSACTIONS AVAILABLE.
            </h5>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-gray-50 text-left">
              {cashTransaction.map((item, index) => (
                <tr key={index}>
                  <td className="w-2/5 max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0 capitalize w-">
                    {item.type}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only sm:hidden">Status</dt>
                      <dd className="mt-1 truncate text-gray-700 sm:hidden">
                        {item.status}
                      </dd>
                      <dt className="sr-only lg:hidden">Reference</dt>
                      <dd className="mt-1 truncate text-gray-500 lg:hidden">
                        {item.reference}
                      </dd>
                    </dl>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 ">
                    $ {formatNumber(item.amount)}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell capitalize">
                    {item.status}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell capitalize">
                    {item.reference}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                    {item.date}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      Edit<span className="sr-only">, {item.amount}</span>
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                      <span className="sr-only">, {item.amount}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </div>
  );
}
