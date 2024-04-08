import React, { useEffect, useState } from "react";
import {
  handleUserApproval,
  handleUserRejection,
} from "../../config/user";
import { Link, useNavigate } from "react-router-dom";
import DotLoader from "../../components/DotLoader";
import { auth, db } from "../../config/firebase";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getBondRequests } from "../../config/bonds";
import { formatNumber } from "../../config/utils";

export default function BondsRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showModal, hideModal } = useModal();
  const navigate = useNavigate();

  const fetchUsersRequest = async () => {
    setIsLoading(true);
    try {
      const usersRequests = await getBondRequests();
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
        onClose: hideModal,
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
        onClose: hideModal,
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
        onClose: hideModal,
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
        onClose: hideModal,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate(`/dashboard/add_new_user`);
  };

  if (isLoading) {
    <div className="mt-8">
      <DotLoader />
    </div>;
  }

  const headings = [
    "User Name",
    "Amount",
    "Status",
    "Type",
  ];

  return (
    <div className="lg:px-4">
      <div className="sm:flex sm:items-center text-left">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Bonds Requests
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the bonds requests made including their full name,
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

      <div className="mt-8 flow-root">
        <div className="overflow-x-auto ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {headings.map((heading, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {heading}
                    </th>
                  ))}
                  <th
                    scope="col"
                    className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50">
                {requests.map((item, idx) => (
                  <tr key={idx}>
                      <td
                        key={idx}
                        className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
                      >
                        {item}
                      </td>
                    {/* {Object.values(item).map((value, index) => (
                    ))} */}
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        to='/dashboard/edit_user/${item.id'
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {item.id}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              {requests.length === 0 && (
                <div className="w-full grid place-items-center p-4">
                  <h5 className="text-gray-400 text-lg ">NO BONDS REQUEST AVAILABLE</h5>
                </div>
              )}
          </div>
        </div>
      </div>

      {!requests || requests.length === 0 ? (
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
                  className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Type
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
                      <dt className="sr-only">User</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {request.uid}
                      </dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1 truncate text-gray-500">
                        {request.email}
                      </dd>
                    </dl>
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 ">
                  $ {formatNumber(request.amountRequested)}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 lg:table-cell truncate">
                    {request.requestStatus}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {request.typeOfRequest}
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 ">
                    {request.createdAt}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleApproval(request.id, request)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Approve<span className="sr-only">, {request.fullName}</span>
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleRejection(request.id, request)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject<span className="sr-only">, {request.userName}</span>
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
