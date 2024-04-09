import React, { useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { TrashIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import AddAdminModal from "../../components/AddAdminModal";
import { deleteAdminUser, fetchAdmins } from "../../config/admin";
import LoadingScreen from "../../components/LoadingScreen";
import { useModal } from "../../context/ModalContext";
import { customModal } from "../../utils/modalUtils";

export default function AddNewAdmin() {
  const { showModal, hideModal} = useModal();
  const [open, setOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = async () => {
    setOpen(true);
  };

  const getAdmins = async () => {
    try {
      const fetchedAdmins = await fetchAdmins();
      setAdmins(fetchedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);


  const handleDelete = (uid) => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this user. This action cannot be undone.`,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonBgColor: "bg-red-600",
      confirmButtonTextColor: "text-white",
      cancelButtonBgColor: "bg-white",
      cancelButtonTextColor: "text-gray-900",
      onConfirm: () => {
        confirmDelete(uid);
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

  const confirmDelete = async (uid) => {
    setIsDeleting(true);
    try {
      await deleteAdminUser(uid);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully deleted this user.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      setOpen(false);
      getAdmins();
    } catch (error) {
      customModal({
        showModal,
        title: "Error!",
        text: `${error} Please try again.`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 3500,
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
 
  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 sm:col-span-10 lg:px-0 text-left">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="flex justify-between items-center space-y-2  px-4 py-4 ">
          <label
            htmlFor="add-team-members"
            className="block text-base font-semibold leading-6 text-gray-900"
          >
            All Admin Users
          </label>
        </div>
        {isDeleting && <LoadingScreen />}
        <div className="border-b border-gray-200  px-4">
          <ul className="divide-y divide-gray-200">
            {admins.map((person) => (
              <li key={person.email} className="flex py-4">
                <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <div className="ml-3 flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {person.name}
                  </span>
                  <span className="text-sm text-gray-500">{person.email}</span>
                </div>
                <button className="cursor-pointer self-end ml-auto mr-0" onClick={() => handleDelete(person.uid)}>
                  <TrashIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className=" bg-gray-50 px-4 py-5 text-right sm:px-6">
          <button
            type="button"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAdd}
          >
            <PlusIcon
              className="-ml-0.5 h-5 w-5 text-white"
              aria-hidden="true"
            />
            Add New Admin
          </button>
        </div>
      </div>
      {
        open && (
          <AddAdminModal
            open={open}
            setOpen={setOpen}
            refresh={getAdmins}
          />
        )
      }
    </div>
  );
}


