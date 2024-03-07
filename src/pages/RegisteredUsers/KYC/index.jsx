import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser } from "../../../config/user";
import { customModal } from "../../../config/modalUtils";
import { useModal } from "../../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  PaperClipIcon
} from "@heroicons/react/24/outline";
import { getFunctions, httpsCallable } from "firebase/functions";
import DotLoader from "../../../components/DotLoader";

export default function ClientInfo() {
    const location = useLocation();
  const navigate = useNavigate();
  const {showModal, hideModal} = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const initialUser = location.state.viewUser;
  const [viewUser, setViewUser] = useState(initialUser || {});
  const {
    uid,
    title,
    fullName,
    jointAccount,
    email,
    mobile,
    home,
    secondaryTitle,
    secondaryAccountHolder,
    address,
    city,
    country,
    postcode,
  } = viewUser;

  const refreshDetails = async () => {
    try {
      const usersData = await getUser(viewUser.uid);
      setViewUser(...usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    refreshDetails();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/dashboard/registered_users/edit/${userId}`, {
      state: { editUser: viewUser },
    });
  };

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete ${viewUser.fullName}'s data. This action cannot be undone.`,
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
      // Initialize the Cloud Function
      const functionsInstance = getFunctions();
      const deleteFunction = httpsCallable(
        functionsInstance,
        "deleteUserAccount"
      );
      // Call the Cloud Function to delete the user from Firestore and Authentication
      const selectedUserId = viewUser.uid;
      await deleteFunction({ userId: selectedUserId });

      customModal({
        showModal,
        title: "Success!",
        text: `${viewUser.fullName}'s data has been deleted successfully.`,
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
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
    <div className="px-4 sm:px-0 text-left">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">
        Know Your Customer (KYC)
      </h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        Complete details about {fullName}'s Account.
      </p>
    </div>
    <div className="mt-6 border-t border-gray-100">
      <dl className="grid grid-cols-1 sm:grid-cols-2 text-left">
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
          What best describes your primary purpose in trading with us?
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
          Get short-term returns.
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Primary Account Holder Name
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {fullName || "N/A"}
          </dd>
        </div>
       {jointAccount ===  true && (
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Secondary Account Holder Title
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {secondaryTitle || "N/A"}
            </dd>
          </div>
        )}
        {jointAccount ===  true && (
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Secondary Account Holder Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
              {secondaryAccountHolder || "N/A"}
            </dd>
          </div>
        )}
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            HomePhone
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {home || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            MobilePhone
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {mobile || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Email address
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {email || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Home Address
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {address || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            City
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {city || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Country
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {country || "N/A"}
          </dd>
        </div>
        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">
            Postcode
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
            {postcode || "N/A"}
          </dd>
        </div>
      </dl>
      <div className="mt-8 flex space-x-3 justify-end">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => handleEdit(uid)}
        >
          Edit Details
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          onClick={handleDelete}
        >
          {isDeleting ? <DotLoader/> : "Delete Details"}
        </button>
      </div>
    </div>
  </div>
  )
}
