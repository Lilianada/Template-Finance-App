import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import {
  deleteBankingDetails,
  getBankingDetails,
} from "../../../config/bankDetails";
import { customModal } from "../../../utils/modalUtils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../../components/DotLoader";
import { getUser } from "../../../config/user";

export default function BankDetails({ initialUser }) {
  const { showModal, hideModal } = useModal();
  const user = initialUser.uid;
  const [bankingDetails, setBankingDetails] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [bankingDetailId, setBankingDetailId] = useState(null);
  const [userCountry, setUserCountry] = useState({
    country: "",
  });
  const country = userCountry.country;

  useEffect(() => {
    fetchBankDetails();
    fetchUserCountry();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const fetchedDetails = await getBankingDetails(user);
      if (fetchedDetails && fetchedDetails.length > 0) {
        setBankingDetails(fetchedDetails[0]);
        setBankingDetailId(fetchedDetails[0]?.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserCountry = async () => {
    if (!user) {
      console.log("No UID found.");
      return;
    }
    try {
      const usersData = await getUser(user);
      if (usersData.length > 0) {
        const userData = usersData[0];
        setUserCountry({
          ...userData,
          country: userData.country,
        });
      }
    } catch (error) {
      console.log("Error fetching user data: ", error);
    }
  };

  const handleDelete = async () => {
    console.log(user);
    setIsDeleting(true);
    try {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete ${initialUser.fullName}'s banking Details. This action cannot be undone.`,
        showConfirmButton: true,
        confirmButtonText: isDeleting ? <DotLoader /> : "Yes, delete",
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
      setIsDeleting(false);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBankingDetails(user, bankingDetailId);
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

  const handleEdit = async (bankingDetails) => {
    navigate(`/dashboard/registered_users/view/edit_bank_details/${user}`, {
      state: { editBank: bankingDetails },
    });
  };

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="px-4 sm:px-0 text-left">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Banking Details
        </h3>
      </div>
      {!bankingDetails || bankingDetails.length === 0 ? (
        <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-8">
          <h5 className="text-gray-400 text-lg">
            NO BANKING DETAIL HAS BEEN ADDED YET.
          </h5>
        </div>
      ) : (
        bankingDetails && (
          <div className="mt-6 text-left">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Account name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {bankingDetails.accountName}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Bank Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {bankingDetails.bankName}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Branch
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {bankingDetails.branch}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  BSB Number
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {bankingDetails.bsbNumber}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Account Number
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {bankingDetails.accountNumber}
                </dd>
              </div>
              {country !== "AU" && (
                <>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Swift Code
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {bankingDetails.swiftCode}
                    </dd>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      IBAN
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                      {bankingDetails.iban}
                    </dd>
                  </div>
                </>
              )}
            </dl>
            <div className="mt-6 flex space-x-3 justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => handleEdit(bankingDetailId)}
              >
                Edit Details
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => handleDelete(bankingDetailId)}
              >
                Delete Details
              </button>
            </div>
          </div>
        )
      )}
      {bankingDetails.length === 0 && (
        <div className="mt-6 flex space-x-3 justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleEdit(bankingDetailId)}
          >
            Add Details
          </button>
        </div>
      )}
    </div>
  );
}
