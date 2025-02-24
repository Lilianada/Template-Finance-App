import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import {
  deleteStockFromDb,
  getStockFromUserDB,
} from "../../../../config/stock";
import { customModal } from "../../../../utils/modalUtils";
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../config/utils";
import LoadingScreen from "../../../../components/LoadingScreen";
import DotLoader from "../../../../components/DotLoader";

export default function ClientStock() {
  const { showModal, hideModal } = useModal();
  const [stocks, serStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      const fetchedStocks = await getStockFromUserDB(userId);
      serStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching Stocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (stock) => {
    navigate(
      `/dashboard/registered_users/view/view_stocks_details/edit_stock/${userId}`,
      {
        state: { stockToEdit: stock },
      }
    );
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this stock investment. This action cannot be undone.`,
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
      await deleteStockFromDb(userId, selectedId);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully deleted this stock.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      setOpen(false);
      fetchStocks();
    } catch (error) {
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error deleting this stock. Please try again.",
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
      <div className="sm:flex-auto text-left mt-4 mb-6">
        <button
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="h-5 w-5 stroke-gray-400 stroke-2" />
          <p className="text-sm text-gray-400 font-semibold">Back</p>
        </button>
      </div>
      <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 rounded-lg">
        <div className="sm:flex sm:items-start">
          <div className="sm:flex-auto text-left">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Stock Investments
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Stocks a user has purchased.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              onClick={() =>
                navigate(
                  `/dashboard/registered_users/view/view_stocks_details/add_stock/${userId}`
                )
              }
            >
              Add Stock
            </button>
          </div>
        </div>
        {isLoading && <DotLoader />}
        <div className="-mx-4 mt-8 sm:-mx-0">
          {stocks === null || stocks.length === 0 ? (
            <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
              <h5 className="text-gray-400 text-base ">
                NO STOCK INVESTMENTS AVAILABLE.
              </h5>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    SYM
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className=" pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Shares
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    TP
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    MP
                  </th>
                  <th
                    scope="col"
                    className="pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    TA
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    +/-(%)
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden pl-2 py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell"
                  >
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-50 divide-y divide-gray-200 text-left">
                {stocks.map((stock, index) => (
                  <tr key={index}>
                    <td className="w-full max-w-0 py-4 pl-2 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none capitalize sm:pl-0">
                      {stock.symbol}
                      <dl className="font-normal lg:hidden">
                        <dt className="sr-only">Type</dt>
                        <dd className="mt-1 text-xs text-gray-500 lg:hidden">
                          {stock.type}
                        </dd>
                      </dl>
                      <dl className="font-normal xl:hidden">
                        <dt className="sr-only "> Date</dt>
                        <dd className="mt-1 text-xs text-gray-500 xl:hidden">
                          {stock.tradeDate}
                        </dd>
                      </dl>
                    </td>
                    <td className="hidden truncate max-w-12 px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {stock.companyName}
                    </td>

                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {stock.type}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 capitalize lg:table-cell">
                      {stock.shares}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      ${formatNumber(stock.tradePrice)}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      ${formatNumber(stock.marketPrice)}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      ${formatNumber(stock.tradeAmount)}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      ${formatNumber(stock.value)}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {stock.profitLoss}%
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {stock.status}
                    </td>
                    <td className="hidden truncate px-3 py-4 text-sm text-gray-500 xl:table-cell">
                      {stock.tradeDate}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        className="text-teal-600 hover:text-teal-900"
                        onClick={() => handleEdit(stock)}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(stock.id)}
                      >
                        {/* <TrashIcon className="h-4 w-4 text-red-500" /> */}
                        Delete
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
