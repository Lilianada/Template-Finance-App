import React, { useEffect, useState } from "react";
import {
  fetchMetaData,
  fetchTitleData,
  updateMetaData,
  updateTitleText,
} from "../../config/settings";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { customModal } from "../../config/modalUtils";
import DotLoader from "../../components/DotLoader";

export default function ChangeMetaData() {
  const { showModal } = useModal();
  const [newMeta, setNewMeta] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingMeta, setExistingMeta] = useState("");
  const [existingTitle, setExistingTitle] = useState("");

  const fetchExistingMetaData = async () => {
    try {
      const existingMeta = await fetchMetaData();
      setExistingMeta(existingMeta);
    } catch (error) {
      // console.error("Error fetching existing meta data:", error);
    }
  };

  const fetchExistingTitleData = async () => {
    try {
      const existingTitle = await fetchTitleData();
      setExistingTitle(existingTitle);
    } catch (error) {
      // console.error("Error fetching existing title data:", error);
    }
  };

  useEffect(() => {
    fetchExistingTitleData();
    fetchExistingMetaData();
  }, []); 

  const handleChange = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Fetch existing data
      const existingMetaData = await fetchMetaData();
      const existingTitle = await fetchTitleData();

      // Use existing values if new values are empty
      const updatedMetaData =
        newMeta.trim() !== "" ? newMeta : existingMetaData;
      const updatedTitle = newTitle.trim() !== "" ? newTitle : existingTitle;

      // Update meta data and title
      await updateMetaData(updatedMetaData);
      await updateTitleText(updatedTitle);

      customModal({
        showModal,
        title: "Data Updated",
        text: "Your data has been updated successfully",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 1500,
      });
      // Fetch updated data
      fetchExistingMetaData();
      fetchExistingTitleData();
    } catch (error) {
      console.error("Error updating data:", error);
      customModal({
        showModal,
        title: "Error",
        text: "An error occurred while updating your data. Please try again later.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-green-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRevert = () => {
    // Revert back to previously fetched meta and title data
    setNewMeta(existingMeta);
    setNewTitle(existingTitle);
  }; 

  return (
    <div className="">
      <form action="#" method="POST" onSubmit={handleChange}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Change Title and Description
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly so be sure of your
                spellings before updating.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="newMeta"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="newMeta"
                    name="newMeta"
                    rows={2}
                    value={newMeta}
                    onChange={(e) => setNewMeta(e.target.value)}
                    className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description for your app.
                </p>
              </div>
            </div>
          </div>

          
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex items-center justify-end gap-x-6"> 
            <button
              type="button"
              onClick={handleRevert}
              className="inline-flex justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Revert
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? (
                <div className="flex w-full justify-center align-middle gap-2">
                  <span>Saving</span>
                  <DotLoader />
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
