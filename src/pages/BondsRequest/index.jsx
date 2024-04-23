import React, { useEffect, useState } from "react";
import DotLoader from "../../components/DotLoader";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  deleteRequestFromFirestore,
  fetchRequestData,
  getBondRequests,
  handleBuyApproval,
  handleSellApproval,
  updateRequestStatusInFirestore,
} from "../../config/bonds";
import { formatNumber } from "../../config/utils";
import { addNotification } from "../../config/notifications";
import LoadingScreen from "../../components/LoadingScreen";

export default function BondsRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showModal, hideModal } = useModal();

  useEffect(() => {
    fetchUsersRequest();
  }, []);

  const fetchUsersRequest = async () => {
    setIsLoading(true);
    try {
      const usersRequests = await getBondRequests();
      setRequests(usersRequests);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequest = (userId, requestId, newStatus) => {
    if (newStatus === "Approved") {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to approve this Bonds investment.`,
        showConfirmButton: true,
        confirmButtonText: "Yes, approve",
        cancelButtonText: "Cancel",
        confirmButtonBgColor: "bg-green-600",
        confirmButtonTextColor: "text-white",
        cancelButtonBgColor: "bg-white",
        cancelButtonTextColor: "text-gray-900",
        onConfirm: () => {
          confirmRequest(userId, requestId, newStatus);
          hideModal();
        },
        onCancel: hideModal(),
        onClose: hideModal(),
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        timer: 0,
      });
    } else {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to decline this Bonds investment. This action cannot be undone.`,
        showConfirmButton: true,
        confirmButtonText: "Yes, decline",
        cancelButtonText: "Cancel",
        confirmButtonBgColor: "bg-red-600",
        confirmButtonTextColor: "text-white",
        cancelButtonBgColor: "bg-white",
        cancelButtonTextColor: "text-gray-900",
        onConfirm: () => {
          confirmRequest(userId, requestId, newStatus);
          hideModal();
        },
        onCancel: hideModal(),
        onClose: hideModal(),
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        timer: 0,
      });
    }
  };

  const confirmRequest = async (userId, requestId, newStatus) => {
    setIsUpdating(true);
    try {
      const requestData = await fetchRequestData(userId, requestId);

      await updateRequestStatusInFirestore(userId, requestId, newStatus);

      let message;
      if (newStatus === "Approved") {
        // If the request is approved, handle buying or selling approval
        if (requestData.typeOfRequest === "buy") {
          await handleBuyApproval(userId, requestData, requestId);
          message = `Your bond request to buy $${requestData.amountRequested} worth of bonds has been approved.`;
        } else if (requestData.typeOfRequest === "sell") {
          await handleSellApproval(userId, requestData, requestId);
          message = `Your bond request to sell $${requestData.amountRequested} worth of bonds has been approved.`;
        }
      } else {
        // Handle declined request
        if (requestData.typeOfRequest === "buy") {
          message = `Your bond request to buy $${requestData.amountRequested} worth of bonds has been declined.`;
        } else if (requestData.typeOfRequest === "sell") {
          message = `Your bond request to sell $${requestData.amountRequested} worth of bonds has been declined.`;
        }
      }

      // Delete the request from Firestore regardless of whether it's declined or approved
      await deleteRequestFromFirestore(userId, requestId);

      // Refresh the table data
      const allRequests = await getBondRequests();
      setRequests(allRequests);

      if (message) {
        await addNotification(userId, message, newStatus);
      }
      customModal({
        showModal,
        title: "Success",
        text: `Request has been ${newStatus} successfully and status updated.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
    } catch (err) {
      console.error("Error updating request:", err);
      customModal({
        showModal,
        title: "Error!",
        text: `There was an error encountered when updating request: ${err}`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="lg:px-4">
      <div className="sm:flex sm:items-center text-left">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Bonds Requests
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the Bonds requests made including their full name,
            email, mobile phone and user id.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        {isUpdating && <LoadingScreen />}
        {isLoading ? (
          <div className="my-8">
            <DotLoader />
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-6">
            <h5 className="text-gray-400 text-lg ">NO REQUESTS FOUND.</h5>
          </div>
        ) : (
          <div className="-mx-4 mt-8 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-300 text-left">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    User Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Issuer Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                  >
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                      {request.userName}
                      <dl className="font-normal lg:hidden">
                        <dt className="sr-only sm:hidden">Issuer Name</dt>
                        <dd className="mt-1 truncate text-gray-500 max-w-16">
                          {request.issuerName}
                        </dd>
                      </dl>
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 ">
                      ${formatNumber(request.amountRequested)}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell truncate">
                      {request.issuerName}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 ">
                      {request.typeOfRequest}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 lg:table-cell truncate">
                      {request.requestStatus}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() =>
                          handleUpdateRequest(
                            request.userId,
                            request.id,
                            "Approved"
                          )
                        }
                        className="text-green-600 hover:text-green-800"
                      >
                        Approve
                        <span className="sr-only">, {request.userName}</span>
                      </button>
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() =>
                          handleUpdateRequest(
                            request.userId,
                            request.id,
                            "Declined"
                          )
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Decline
                        <span className="sr-only">, {request.userName}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
