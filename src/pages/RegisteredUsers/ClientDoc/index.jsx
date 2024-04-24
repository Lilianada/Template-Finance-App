import React, { useEffect, useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import {
  deleteDocument,
  fetchUserDocument,
} from "../../../config/documents";
import {
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { customModal } from "../../../utils/modalUtils";
import { useModal } from "../../../context/ModalContext";
import EditDoc from "./Edit";
import LoadingScreen from "../../../components/LoadingScreen";

export default function ClientDoc({ initialUser }) {
  const user = initialUser.id;
  const { showModal, hideModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [doc, setDoc] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchDoc = async () => {
    try {
      const userDoc = await fetchUserDocument(user);
      setDoc(userDoc);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  const handleUpdate = async () => {
    setOpen(true);
  };

  const handleDelete = async (doc) => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this document. This action cannot be undone.`,
      showConfirmButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonBgColor: "bg-red-600",
      confirmButtonTextColor: "text-white",
      cancelButtonBgColor: "bg-white",
      cancelButtonTextColor: "text-gray-900",
      onConfirm: () => {
        confirmDelete(doc);
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

  const confirmDelete = async (doc) => {
    setIsLoading(true);

    try {
      await deleteDocument(user, doc.id, doc.fileName);
      customModal({
        showModal,
        title: "Success",
        text: "Document has been deleted successfully.",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 1500,
      });
      fetchDoc();
    } catch (error) {
      console.error("Error during document deletion:", error);

      // Show an error message to the user
      customModal({
        showModal,
        title: "Error",
        text: "An error occurred while deleting document. Please try again later.",
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "text-red-600",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="px-4 sm:px-0 text-left">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Documents
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
         Add your National ID, Passport or Driver's Liscence.
        </p>
      </div>
      <div className="px-4 pt-6 sm:col-span-2 sm:px-0">
        {isLoading && <LoadingScreen />}
        {isDownloading && <LoadingScreen /> }
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {doc ? (
              doc.map((doc) => (
                <li
                  className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  key={doc.id}
                >
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        {doc.fileDescription}
                      </span>
                      <span className="text-gray-200" aria-hidden="true">
                        |
                      </span>
                      <span className="truncate text-gray-500">
                        {doc.fileName}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0 space-x-4">
                    <button
                      type="button"
                      className="rounded-md bg-gray-50 font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <span className="text-gray-200" aria-hidden="true">
                      |
                    </span>
                    <button
                      type="button"
                      className="rounded-md bg-gray-50 font-medium text-gray-900 hover:text-gray-800"
                      onClick={() => handleDelete(doc)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <div className="w-full grid place-items-center rounded-xl p-4 ">
          <h5 className="text-gray-400 text-lg">
            NO DOCUMENT HAS BEEN ADDED YET.
          </h5>
        </div>
            )}
          </ul>
          {!doc && (
            <div className="mt-6 flex space-x-3 justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleUpdate}
              >
                Add Doc
              </button>
            </div>
          )}
        </dd>
      </div>
      {open && (
        <EditDoc
          open={open}
          setOpen={setOpen}
          userId={user}
          doc={doc}
          refresh={fetchDoc}
        />
      )}
    </div>
  );
}
