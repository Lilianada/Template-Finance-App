import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import DotLoader from "../../components/DotLoader";
import { customModal } from "../../utils/modalUtils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useModal } from "../../context/ModalContext";
import { addUserAsync } from "../../store/user/userSlice";

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

export default function AddNewUser() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(123456);
  const { showModal, hideModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    jointAccount: false,
    secondaryAccountHolder: "",
    secondaryTitle: "",
    password: password,
    mobilePhone: "",
    homePhone: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const {
      title,
      fullName,
      jointAccount,
      secondaryAccountHolder,
      secondaryTitle,
      email,
      password,
      mobilePhone,
      homePhone,
      address,
      city,
      country,
      postcode,
    } = formData;

    // Validation
    if (
      !title ||
      !fullName ||
      !email ||
      !password ||
      !mobilePhone ||
      !address ||
      !city ||
      !country ||
      !postcode
    ) {
      return customModal({
        showModal,
        title: "Error!",
        text: "Please fill in all required fields.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
        onClose: hideModal,
      });
    }
    setIsLoading(true);
    try {
      // Dispatch the addUserAsync thunk action
      await dispatch(
        addUserAsync({
          title,
          fullName,
          jointAccount,
          secondaryAccountHolder,
          secondaryTitle,
          email,
          password,
          mobilePhone,
          homePhone,
          address,
          city,
          country,
          postcode,
        })
      ).unwrap();

      customModal({
        showModal,
        title: "User Created!",
        text: `${fullName}'s data has been created and password reset email sent.`,
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
        onClose: hideModal,
      });
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (error) {
      console.error("Error adding user:", error);
      customModal({
        showModal,
        title: "Error!",
        text: `There was an error creating the user. ${error}`,
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="text-left bg-gray-50 px-6 py-8" onSubmit={handleAdd}>
      <div className="space-y-12">
        <div className="">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            Create New User
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Fill in the correct details of the user you wish to create.
          </p>
        </div>

        <div className="pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4 flex items-center gap-2">
              <div className="">
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
                  <option value="">Select Title</option>
                  <option value="Miss">Miss</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Rev">Rev</option>
                  <option value="Other">Other</option>
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

            {!formData.jointAccount === false && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="secondaryTitle"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Secondary Account Holder Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="secondaryTitle"
                    id="secondaryTitle"
                    onChange={handleChange}
                    value={formData.secondaryTitle || ""}
                    autoComplete="secondaryTitle"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}

            {!formData.jointAccount === false && (
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
                htmlFor="homePhone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home Phone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="homePhone"
                  id="homePhone"
                  onChange={handleChange}
                  value={formData.homePhone || ""}
                  autoComplete="homePhone"
                  placeholder="e.g. +234-567-8901"
                  required
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
                  placeholder="e.g. +234-567-8901"
                  value={formData.mobilePhone || ""}
                  autoComplete="mobilePhone"
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
                htmlFor="homePhone-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Home Address
              </label>
              <div className="mt-2">
                <input
                  id="homePhone-address"
                  name="address"
                  type="text"
                  onChange={handleChange}
                  value={formData.address || ""}
                  required
                  autoComplete="homePhone-address"
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
                  required
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
                  required
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
          {isLoading ? <DotLoader /> : "Create"}
        </button>
      </div>
    </form>
  );
}
