import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { deleteUserIpo, getUserIpos } from "../../../../config/ipos";
import { customModal } from "../../../../config/modalUtils";
import LoadingScreen from "../../../../components/LoadingScreen";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../config/utils";

export default function ClientIposPage() {
  const { showModal, hideModal } = useModal();
  const [ipos, setIpos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    try {
      const result = await getUserIpos(userId);
      setIpos(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (Ipos) => {
    setOpen(true);
    setSelectedId(Ipos);
  };

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this bond investment. This action cannot be undone.`,
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
    console.log(selectedId);
    try {
      await deleteUserIpo(userId, selectedId);
      customModal({
        showModal,
        title: "Success!",
        text: `The investment has been deleted successfully.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
      fetchIpos();
    } catch (error) {
      console.error("Failed to delete user:", error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error deleting the investment. Please try again.",
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

  if (isDeleting) {
    <LoadingScreen />;
  }

  return (
    <div className="px-4 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            IPOs
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the IPOs a user has purchased
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() =>
              navigate(`/dashboard/registered_users/view/view_ipos/${userId}`)
            }
          >
            Add IPOs
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        {ipos === null ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-12">
            <h5 className="text-gray-400 text-base ">
              NO IPOS TRANSACTIONS AVAILABLE.
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
                  Company Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Shares
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Share Price
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="hidden backdrop:px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Purchase Date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-left">
              {ipos.map((item, index) => (
                <tr key={index}>
                  <td className="w-2/5 max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0 capitalize">
                    {item.name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only sm:hidden">Share Price</dt>
                      <dt className="sr-only lg:hidden">Type</dt>
                      <dd className="mt-1 truncate text-gray-700 sm:hidden">
                        {item.type}
                      </dd>
                      <dd className="mt-1 truncate text-gray-500 lg:hidden">
                        $ {formatNumber(item.sharePrice)}
                      </dd>
                      <dt className="sr-only lg:hidden">Purchase Date</dt>
                      <dd className="mt-1 truncate text-gray-700 lg:hidden">
                        {item.date}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell capitalize">
                    {item.type}
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500">
                    {item.numberOfShares}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    $ {formatNumber(item.sharePrice)}
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    $ {formatNumber(item.numberOfShares * item.sharePrice)}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500  lg:table-cell">
                    {item.date}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit<span className="sr-only">, {item.issuerName}</span>
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => {setSelectedId(item.id); handleDelete();}}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                      <span className="sr-only">, {item.issuerName}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* <EditBondsDetails
        userId={userId}
        bond={selectedId}
        setBond={setSelectedId}
        open={open}
        setOpen={setOpen}
        refreshDetails={fetchBonds}
      /> */}
      </div>
    </div>
  );
}
