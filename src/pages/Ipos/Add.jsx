import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import {
  PhotoIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import CurrencyInput from "react-currency-input-field";
import { addNewIpos } from "../../config/ipos";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { customModal } from "../../config/modalUtils";
import DotLoader from "../../components/DotLoader";

export default function AddIpos() {
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    description: "",
    expListingPrice: 0,
    expectedDate: "",
    minInvestment: 0,
    preAllocation: "",
    preSharePrice: 0,
    sharePrice: 0,
    index: 0,
  });
  const [pricePerShare, setPricePerShare] = useState(false);

  const handlePricePerShare = (e) => {
    const priceShareSelected = e.target.value === "To be announced";
    setPricePerShare(priceShareSelected);

    if (priceShareSelected) {
      setFormData({
        ...formData,
        preSharePrice: "To Be Announced",
      });
    } else {
      setFormData({
        ...formData,
        preSharePrice: 0,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // Make sure files[0] exists
      if (files.length > 0) {
        const selectedFile = files[0];
        handleUploadImage(selectedFile)
          .then((downloadURL) => {
            setFormData({
              ...formData,
              [name]: selectedFile,
              imagePreview: downloadURL, // Update imagePreview with the download URL
            });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUploadImage = async (imageFile) => {
    if (imageFile instanceof File) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);
      try {
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        throw error;
      }
    } else if (typeof imageFile === "string") {
      // Image is already a URL, no need to re-upload
      return imageFile;
    } else {
      return null; // Handle other cases (e.g., null) as needed
    }
  };

  const handleCurrencyChange = (value, name) => {
    let numericValue = parseFloat(value);

    // Check if the parsed value is NaN, if so, set it to 0
    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.logo) {
        const imageUrl = await handleUploadImage(formData.logo);
        formData.logo = imageUrl; // Update the image field with the Firebase Storage URL
      }
      await addNewIpos(formData);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully added a new IPOS.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      });
      reset();
    } catch (error) {
      console.error(error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error adding IPOS. Please try again.",
        showConfirmButton: false,
        icon: ExclamationTriangleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        timer: 2000,
      });
    }
    setIsLoading(false);
  };

  const reset = () => {
    setFormData({
      name: "",
      logo: null,
      description: "",
      expListingPrice: 0,
      expecteDate: "",
      minInvestment: 0,
      preAllocation: "",
      preSharePrice: 0,
      sharePrice: 0,
      index: 0,
    });
  };

  return (
    <form className="m-2" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 text-left">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add New IPOS
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Confirm the details before submitting the IPOS.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="logo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="preview"
                    className="h-12 w-12 rounded-lg bg-white ring-1 ring-gray-900/10 object-contain"
                  />
                ) : (
                  <PhotoIcon
                    className="h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <input
                  type="file"
                  name="logo"
                  id="file"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => document.getElementById("file").click()}
                >
                  Add Image
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="index"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Number Index
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="index"
                  id="index"
                  value={formData.index}
                  onChange={handleChange}
                  autoComplete="index"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  autoComplete="description"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="expListingPrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Expected Listing Price
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <CurrencyInput
                  decimalSeparator="."
                //   prefix="$"
                  name="expListingPrice"
                  placeholder="0.00"
                  value={formData.expListingPrice}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    handleCurrencyChange(formattedValue, "expListingPrice");
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="expectedDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Expected Date
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="expectedDate"
                  id="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleChange}
                  autoComplete="expectedDate"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="isin"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Minimum Investment
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <CurrencyInput
                  decimalSeparator="."
                //   prefix="$"
                  name="minInvestment"
                  placeholder="0.00"
                  value={formData.minInvestment}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    handleCurrencyChange(formattedValue, "minInvestment");
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="preAllocation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pre Allocation
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <CurrencyInput
                  decimalSeparator="."
                //   prefix="$"
                  name="preAllocation"
                  placeholder="0.00"
                  value={formData.preAllocation}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    handleCurrencyChange(formattedValue, "preAllocation");
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="preSharePrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Pre Share Price
              </label>
              <div className="mt-2">
                <select
                  id="preSharePrice"
                  name="sharePriceToggle"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 
                  onChange={handlePricePerShare}
                >
                  <option value="Price">Price</option>
                  <option value="To be announced">To Be Announced</option>
                </select>
              </div>
              {!pricePerShare && (
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <CurrencyInput
                    decimalSeparator="."
                    // prefix="$"
                    name="preSharePrice"
                    value={formData.preSharePrice}
                    onValueChange={(value) => {
                      const formattedValue = parseFloat(value).toFixed(2);
                      handleCurrencyChange(formattedValue, "preSharePrice");
                    }}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="price-currency"
                    >
                      USD
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="sharePrice"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Share Price
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <CurrencyInput
                  decimalSeparator="."
                //   prefix="$"
                  name="sharePrice"
                  placeholder="0.00"
                  value={formData.sharePrice}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    handleCurrencyChange(formattedValue, "sharePrice");
                  }}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Close
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
  );
}
