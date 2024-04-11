import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import DotLoader from "../../../../components/DotLoader";
import { convertDateToISO, formatNumber } from "../../../../config/utils";
import { customModal } from "../../../../utils/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { deleteCashDeposit, updateCashDeposit } from "../../../../config/cashBalance";

export default function EditCashBalance() {
  const location = useLocation();
  const { userId } = useParams();
  const { details } = location.state || {};

  const cashTransaction = useSelector(
    (state) => state.cashDeposits.userCashDeposits
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal, hideModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    amount: details.amount,
    type: details.type,
    reference: details.reference,
    status: details.status,
    date: details.date,
  });

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const result = cashTransaction.find(
        (transaction) => transaction.id === details
      );
      setFormData(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const resultAction = await updateCashDeposit({
        userId,
        depositId: details,
        updatedData: formData,
      });
      const result = resultAction.payload;

      if (result.success) {
        customModal({
          showModal,
          title: "Updated!",
          text: `The Cash transaction details has been updated.`,
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
      } else {
        throw new Error("Failed to update the cash deposit.");
      }
    } catch (error) {
      console.error(error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error updating cash transaction. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      const [year, month, day] = value.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      // For all other fields
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDelete = () => {
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
      await deleteCashDeposit({ userId, depositId: details.id });
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

      window.history.back();
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
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleUpdate}>
      <div className="space-y-12">
        <div className="">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Edit Portfolio Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            If you wish to remove any information, please do so below by
            updating the field to "Nil" or "N/A." Any fields left blank will not
            be updated as the current data will be retained.
          </p>
        </div>

        <div className="pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  onChange={handleChange}
                  value={`$ ${formatNumber(formData.amount)}` || ""}
                  autoComplete="amount"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="type"
                  id="type"
                  required
                  onChange={handleChange}
                  value={formData.type || ""}
                  autoComplete="type"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 capitalize"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="reference"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Reference
              </label>
              <div className="mt-2">
                <input
                  id="reference"
                  name="reference"
                  type="text"
                  onChange={handleChange}
                  value={formData.reference || ""}
                  required
                  autoComplete="reference"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 capitalize"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select status</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  onChange={handleChange}
                  value={formData.date ? convertDateToISO(formData.date) : ""}
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
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Close
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          {isEditing ? <DotLoader /> : "Update Details"}
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          onClick={handleDelete}
        >
          {isDeleting ? <DotLoader /> : "Delete Details"}
        </button>
      </div>
    </form>
  );
}
