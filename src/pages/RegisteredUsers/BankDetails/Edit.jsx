import React, { useEffect, useState } from "react";
import { useModal } from "../../../context/ModalContext";
import {
  deleteBankingDetails,
  getBankingDetails,
  manageBankingDetails,
} from "../../../config/bankDetails";
import { customModal } from "../../../utils/modalUtils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../../components/DotLoader";
import { getUser } from "../../../config/user";
import { useParams } from "react-router-dom";

export default function EditBankDetails({ initialUser }) {
  const { showModal, hideModal } = useModal();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bankingDetailId, setBankingDetailId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    bsbNumber: "",
    accountNumber: "",
    branch: "",
    swiftCode: "",
    iban: "",
  });
  const [userCountry, setUserCountry] = useState({
    country: "",
  });
  const country = userCountry.country;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    const {
      accountName,
      bankName,
      bsbNumber,
      accountNumber,
      branch,
    } = formData;

    if (!accountName || !bankName || !bsbNumber || !accountNumber || !branch) {
      return customModal({
        showModal,
        title: "Error!",
        text: `All fields are required`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
    }

    try {
      await manageBankingDetails(userId, formData, bankingDetailId);
      customModal({
        showModal,
        title: "Success!",
        text: `Banking details have been added for ${accountName}.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
      setIsEditing(true);
    } catch (error) {
      console.error("Error adding banking details:", error);
      customModal({
        showModal,
        title: "Error!",
        text: `There was an error adding the banking details.`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
        onClose: hideModal,
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete ${userId.fullName}'s banking Details. This action cannot be undone.`,
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
    } catch (error) {
      console.error("Failed to delete Banking Details:", error);
      customModal({
        showModal,
        title: "Error!",
        text: `Failed to delete Banking Details.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBankingDetails(userId, bankingDetailId);
      customModal({
        showModal,
        title: "Success!",
        text: `${initialUser.fullName}'s data has been deleted successfully.`,
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
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchUserCountry = async () => {
    setIsLoading(true);
    if (!userId) {
      return;
    }
    try {
      const usersData = await getUser(userId);
      if (usersData.length > 0) {
        const userData = usersData[0];
        setUserCountry({
          ...userData,
          country: userData.country,
        });
      }
    } catch (error) {
      console.log("Error fetching user data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetails = async () => {
    setIsLoading(true);

    try {
      const details = await getBankingDetails(userId);
      setFormData(details[0]);
      setBankingDetailId(details[0].id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchUserCountry();
  }, []);

  return (
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleUpdate}>
      <div className="space-y-12">
        <div className="">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Edit Banking Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            If you wish to remove any information, please do so below by
            updating the field to "Nil" or "N/A." Any fields left blank will not
            be updated as the current data will be retained.
          </p>
        </div>
      </div>

      <div className="pb-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="account-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Account Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="accountName"
                id="account-name"
                onChange={handleChange}
                value={formData.accountName || ""}
                required
                autoComplete="account-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="bank-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Bank Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="bankName"
                id="bank-name"
                onChange={handleChange}
                value={formData.bankName || ""}
                required
                autoComplete="bank-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="branch"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Branch
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="branch"
                id="branch"
                onChange={handleChange}
                value={formData.branch || ""}
                required
                autoComplete="branch"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="bsbNumber"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              BSB Number
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="bsbNumber"
                id="bsbNumber"
                onChange={handleChange}
                value={formData.bsbNumber || ""}
                required
                autoComplete="bsbNumber"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Account Number
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="accountNumber"
                id="accountNumber"
                onChange={handleChange}
                value={formData.accountNumber || ""}
                required
                autoComplete="accountNumber"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {country !== "AU" && (
            <>
              <div className="sm:col-span-3">
                <label
                  htmlFor="iban"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  IBAN
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="iban"
                    id="iban"
                    onChange={handleChange}
                    value={formData.iban || ""}
                    required
                    autoComplete="iban"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="swiftCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  BIC/SWIFT
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="swiftCode"
                    id="swiftCode"
                    onChange={handleChange}
                    value={formData.swiftCode || ""}
                    required
                    autoComplete="swiftCode"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          )}
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
          {isEditing ? (
            <div className="flex w-full justify-center align-middle gap-2">
              <span>Updating</span>
              <DotLoader />
            </div>
          ) : (
            "Update Details"
          )}
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          onClick={() => handleDelete(bankingDetailId)}
        >
          {isDeleting ? (
            <div className="flex w-full justify-center align-middle gap-2">
              <span>Deleting</span>
              <DotLoader />
            </div>
          ) : (
            "Delete Details"
          )}
        </button>
      </div>
    </form>
  );
}
