import React, { useEffect, useState } from "react";
import {
  fetchUserRequests,
  handleUserApproval,
  handleUserRejection,
} from "../../config/user";
import { useNavigate } from "react-router-dom";
import DotLoader from "../../components/DotLoader";
import { auth, db } from "../../config/firebase";
import { customModal } from "../../config/modalUtils";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, hideeModal } = useModal();
  const navigate = useNavigate();

  const fetchUsersRequest = async () => {
    setIsLoading(true);
    try {
      const usersRequests = await fetchUserRequests(db);
      setRequests(usersRequests);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsersRequest();
  }, []);

  //HANDLE APPROVAL
  const handleApproval = async (userId, requestData) => {
    setIsLoading(true);
    try {
      await handleUserApproval(db, auth, userId, requestData);
      // Update UI based on the response
      fetchUsersRequest(db);
      customModal({
        showModal,
        title: "Approved",
        text: "This request has been successfully approved. User registeration is now complete.",
        showConfirmButton: false,
        timer: 2000,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        onClose: hideeModal,
      });
    } catch (error) {
      // Handle any errors
      console.error("Error approving user:", error);
      customModal({
        showModal,
        title: "Error",
        text: "There was an error approving this request. please try again.",
        showConfirmButton: false,
        timer: 2000,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        onClose: hideeModal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //HANDLE REJECTION
  const handleRejection = async (userId, requestData) => {
    setIsLoading(true);
    try {
      await handleUserRejection(db, userId, requestData);
      // Update UI based on the response
      customModal({
        showModal,
        title: "Rejected",
        text: "This request has been rejected and removed successfully.",
        showConfirmButton: false,
        timer: 2000,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        onClose: hideeModal,
      });
      fetchUsersRequest(db);
    } catch (error) {
      // Handle any errors
      console.error("Error rejecting user:", error);
      customModal({
        showModal,
        title: "Error",
        text: "There was an error rejecting this request.",
        showConfirmButton: false,
        timer: 2000,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        onClose: hideeModal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate(`/dashboard/add_new_user`);
  };

  return (
    <div className="lg:px-4">
      <div className="sm:flex sm:items-center text-left">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            User Requests
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the user requests made including their full name,
            email, mobile phone and user id.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddUser}
          >
            Create New User
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="mt-8">
          <DotLoader />
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
                  Full Name
                </th>
                <th
                  scope="col"
                  className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                >
                  Mobile
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  User Id
                </th>
                <th
                  scope="col"
                  className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                >
                  Date
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {requests.map((user, index) => (
                <tr key={index}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {user.fullName}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">User</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {user.uid}
                      </dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1 truncate text-gray-500">
                        {user.email}
                      </dd>
                    </dl>
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 ">
                    {user.mobilePhone}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell truncate">
                    {user.email}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {user.uid}
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 ">
                    {user.createdAt}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleApproval(user.id, user)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Approve<span className="sr-only">, {user.fullName}</span>
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleRejection(user.id, user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject<span className="sr-only">, {user.fullName}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
