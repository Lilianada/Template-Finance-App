import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DotLoader from "../../../../components/DotLoader";
import { convertDateToISO, formatNumber } from "../../../../config/utils";
import { customModal } from "../../../../config/modalUtils";
import { useModal } from "../../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { deleteUserBond, updateBondUser } from "../../../../config/bonds";

export default function AddUserBonds () {
  const location = useLocation();
  const { userId } = useParams();
  const { details } = location.state || {};
  
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal, hideModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    issuerName: "",
    currentValue:"",
    quantity: "",
    purchaseDate: "",
    maturityDate: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const result = await updateBondUser(userId, details.id, details)

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
      await deleteUserBond(userId, details.id)
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
            Add Bond Information
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
                  value={formData.issuerName}
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
                <input
                  type="text"
                  name="currentValue"
                  id="currentValue"
                  required
                  onChange={handleChange}
                  value={`$ ${formatNumber(formData.currentValue)}` || ""}
                  autoComplete="currentValue"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 capitalize"
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
                  value={formData.quantity || ""}
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
                  value={formData.purchaseDate ? convertDateToISO(formData.purchaseDate) : ""}
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
                  value={formData.maturityDate ? convertDateToISO(formData.maturityDate) : ""}
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
