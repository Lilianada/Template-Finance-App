import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { getUser, updateUser } from "../../config/user";
import DotLoader from "../../components/DotLoader";
import { customModal } from "../../config/modalUtils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "../../context/ModalContext";
import { getFunctions, httpsCallable } from "firebase/functions";

const CountrySelect = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
      });
  }, []);

  const handleCountryChange = (selectedOption) => {
    onChange({ target: { name: "country", value: selectedOption.label } });
  };

  return (
    <Select
      options={countries}
      value={countries.find((c) => c.label === value) || ""}
      onChange={handleCountryChange}
    />
  );
};

export default function Edit() {
  const location = useLocation();
  const { editUser } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    title: editUser.title,
    fullName: editUser.fullName,
    jointAccount: editUser.jointAccount,
    secondaryAccountHolder: editUser.secondaryAccountHolder,
    secondaryTitle: editUser.secondaryTitle,
    email: editUser.email,
    mobile: editUser.mobilePhone,
    home: editUser.homePhone,
    address: editUser.address,
    city: editUser.city,
    country: editUser.country,
    postcode: editUser.postcode,
  });

  const refreshDetails = async () => {
    try {
      const usersData = await getUser(editUser.uid);
      setFormData(...usersData);
      console.log("usersData", usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const {
      fullName,
      email,
      mobile,
    } = formData;

    // Check if required fields are filled
    if (!fullName || !email || !mobile) {
      return customModal({
        showModal,
        title: "Error!",
        text: "There was an error updating the user. Please fill in the required fields.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    }

    // Filter out empty fields
    const updatedUser = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value)
    );

    if (Object.keys(updatedUser).length === 0) {
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error updating the user. Please fill in the required fields.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });

      return;
    }
    setIsEditing(true);

    try {
      await updateUser(editUser.uid, updatedUser);
      customModal({
        showModal,
        title: "Updated!",
        text: `${updatedUser.fullName}'s data has been updated.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      refreshDetails();
    } catch (error) {
      console.error("Error updating user:", error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error updating the user. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete ${editUser.fullName}'s data. This action cannot be undone.`,
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
      const selectedUserId = editUser.uid;
      await deleteFunction({ userId: selectedUserId });

      customModal({
        showModal,
        title: "Success!",
        text: `${editUser.fullName}'s data has been deleted successfully.`,
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
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleUpdate}>
      <div className="space-y-12">
        <div className=''>
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Edit Account Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            If you wish to remove any information, please do so below by updating the field to "Nil" or "N/A." 
            Any fields left blank will not be updated as the current data will be retained.
          </p>
        </div>

        <div className="pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4 flex items-center gap-2">
              <div className=''>
                <input
                  type="checkbox"
                  name="jointAccount"
                  id="jointAccount"
                  onChange={handleChange}
                  checked={formData.jointAccount || false}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <label
                htmlFor="jointAccount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Joint Account
              </label>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Primary Account Holder Title
              </label>
              <div className="mt-2">
                <select
                  id="title"
                  name="title"
                  autoComplete="title"
                  onChange={handleChange}
                  value={formData.title || ""}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value=''>Select Title</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Rev">Rev</option>
                  <option value="Other">Other</option>
                  <option value="Other">N/A</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="full-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Primary Account Holder Full Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="fullName"
                  id="full-name"
                  onChange={handleChange}
                  value={formData.fullName || ""}
                  required
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {formData.jointAccount === true && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="secondaryTitle"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Secondary Account Holder Title
                </label>
                <div className="mt-2">
                <select
                  id="secondaryTitle"
                  name="secondaryTitle"
                  autoComplete="secondaryTitle"
                  onChange={handleChange}
                  value={formData.secondaryTitle || ""}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="">Select Title</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Rev">Rev</option>
                  <option value="Other">Other</option>
                  <option value="Other">N/A</option>
                </select>
              </div>
              </div>
            )}

            {formData.jointAccount === true && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="secondaryAccountHolder"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Secondary Account Holder Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="secondaryAccountHolder"
                    id="full-name"
                    onChange={handleChange}
                    value={formData.secondaryAccountHolder || ""}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-3">
              <label
                htmlFor="home"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home Phone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="home"
                  id="home"
                  onChange={handleChange}
                  value={formData.home || ""}
                  autoComplete="homePhone"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="mobilePhone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Phone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="mobilePhone"
                  id="mobilePhone"
                  required
                  onChange={handleChange}
                  value={formData.mobile || ""}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email || ""}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="home-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home Address
              </label>
              <div className="mt-2">
                <input
                  id="home-address"
                  name="address"
                  type="text"
                  onChange={handleChange}
                  value={formData.address || ""}
                  required
                  autoComplete="home-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  onChange={handleChange}
                  value={formData.city || ""}
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postcode"
                  id="postcode"
                  onChange={handleChange}
                  value={formData.postcode || ""}
                  autoComplete="post-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>

              <CountrySelect
                value={formData.country || ""}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex space-x-6 justify-end">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Close
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          {isEditing ? <DotLoader /> : "Update User"}
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          onClick={handleDelete}
        >
          {isDeleting ? <DotLoader /> : "Delete User"}
        </button>
      </div>
    </form>
  );
}
