import { Dialog, Transition } from "@headlessui/react";
import DotLoader from "./DotLoader";
import { Fragment, useState } from "react";
import { useModal } from "../context/ModalContext";
import { addAdminUser } from "../config/admin";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { customModal } from "../utils/modalUtils";

export default function AddAdminModal({ setOpen, open, refresh }) {
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await addAdminUser(fullName, email, password);
      setEmail("");
      setFullName("");
      setPassword("");
      customModal({
        showModal,
        title: "Success",
        text: "Admin user added successfully",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        timer: 3000,
      });
      refresh();
    } catch (error) {
      console.error("Error adding admin user:", error);
      customModal({
        showModal,
        title: "Error",
        text: error,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        cancelButtonText: "Cancel",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                <button
                  type="button"
                  className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <form
                  className="text-left px-4 pt-6 pb-4"
                  onSubmit={handleAddAdmin}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-12">
                    <div className="">
                      <h2 className="text-xl font-semibold leading-7 text-gray-900">
                        Add New Admin
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Add email, full name and password for the new admin
                      </p>
                    </div>

                    <div className="pb-4">
                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            autoComplete="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-6 justify-end">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      {isLoading ? (
                        <div className="flex w-full justify-center align-middle gap-2">
                          <span>Submitting</span>
                          <DotLoader />
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
