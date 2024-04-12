import React, { useEffect, useState } from "react";
import { TrashIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
} from "../../config/notifications";
import { useModal } from "../../context/ModalContext";
import { customModal } from "../../utils/modalUtils";
import {
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../components/DotLoader";
import LoadingScreen from "../../components/LoadingScreen";

export default function Notifications() {
  const { showModal, hideModal } = useModal();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Fetch notifications for the specified user (userId) and set them in the component's state
      const userNotifications = await getNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (status, itemId) => {
    if (status === "single") {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete this notification.`,
        showConfirmButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonBgColor: "bg-red-600",
        confirmButtonTextColor: "text-white",
        cancelButtonBgColor: "bg-white",
        cancelButtonTextColor: "text-gray-900",
        onConfirm: () => {
          handleDeleteNotification(itemId);
          hideModal();
        },
        onCancel: hideModal,
        onClose: hideModal,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        timer: 0,
      });
    } else {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete all available notifications. This action cannot be undone.`,
        showConfirmButton: true,
        confirmButtonText: "Yes, delete all",
        cancelButtonText: "Cancel",
        confirmButtonBgColor: "bg-red-600",
        confirmButtonTextColor: "text-white",
        cancelButtonBgColor: "bg-white",
        cancelButtonTextColor: "text-gray-900",
        onConfirm: () => {
          handleDeleteAll();
          hideModal();
        },
        onCancel: hideModal,
        onClose: hideModal,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        timer: 0,
      });
    }
  }; 

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await deleteAllNotifications();
      customModal({
        showModal,
        title: "Success",
        text: `All notifications has been deleted successfully.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      setNotifications([]);
    } catch (error) {
      customModal({
        showModal,
        title: "Error",
        text: `Failed to delete all notifications.`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
      console.error("Failed to delete all notifications:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteNotification = async (itemId) => {
    setIsDeleting(true);
    try {
      await deleteNotification(itemId);
      
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== itemId
        )
      );
      customModal({
        showModal,
        title: "Success",
        text: `Notification deleted successfully.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
    } catch (error) {
      customModal({
        showModal,
        title: "Error",
        text: `Failed to delete notification.`,
        showConfirmButton: false,
        icon: ExclamationCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
      console.error("Failed to delete notification:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  function getHumanReadableTimestamp(timestamp) {
    if (!timestamp) {
      return "Invalid timestamp";
    }

    const now = new Date();
    const timestampDate = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date

    const diff = now - timestampDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days >= 2) {
      // More than 2 days, show the month and time
      const options = {
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return timestampDate.toLocaleDateString(undefined, options);
    } else if (days >= 1) {
      // Yesterday
      const options = { hour: "2-digit", minute: "2-digit" };
      return `Yesterday at ${timestampDate.toLocaleTimeString(
        undefined,
        options
      )}`;
    } else if (hours >= 1) {
      // Hours ago
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes >= 1) {
      // Minutes ago
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      // Seconds ago
      return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
    }
  }

  useEffect(() => {
    handleFetchNotifications();
  }, []);

  return (
    <div className=" lg:flex-shrink-0 lg:border-gray-200 ">
      <div className="">
        <div className="pb-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-left text-lg font-semibold">Notifications</h2>
            <button
              type="button"
              onClick={() => handleDelete("all")}
              className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Delete all
            </button>
          </div>
            {isLoading && (
                <div className="w-full">
                <LoadingScreen />
              </div>
            )}
            {isDeleting && <LoadingScreen />}
          <ul className="divide-y divide-gray-200 bg-gray-50 p-4 sm:p-6">
            {notifications && notifications.length === 0 ? (
              <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-6">
                <h5 className="text-gray-400 text-lg">
                  {" "}
                  YOU HAVE NO NOTIFICATIONS.
                </h5>
              </div>
            ) : (
              notifications.map((item, index) => (
                <li key={index} className="py-4">
                  <div className="flex space-x-3">
                    <UserCircleIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-left">
                          {item.message}{" "}
                          {getHumanReadableTimestamp(item.timeStamp)}.
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleDelete("single", item.id)}
                        >
                          <TrashIcon
                            className="h-4 w-4 text-red-400"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
