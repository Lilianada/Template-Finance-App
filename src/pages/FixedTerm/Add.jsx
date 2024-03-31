import React, { useState } from 'react'
import { addNewTerm } from '../../config/terms';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { customModal } from '../../config/modalUtils';
import { useModal } from '../../context/ModalContext';
import { PhotoIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import DotLoader from '../../components/DotLoader';
import CurrencyInput from "react-currency-input-field";

export default function AddFixedTerm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { showModal } = useModal();
    const [formData, setFormData] = useState({
      logo: "",
      bankName: "",
      minAmount: 0,
      interestRate: 0,
      term: "",
      index: 0,
    });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
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
            console.error('Error uploading image:', error);
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
        console.error('Error uploading image to Firebase Storage:', error);
        throw error;
      }
    } else if (typeof imageFile === 'string') {
      // Image is already a URL, no need to re-upload
      return imageFile;
    } else {
      return null; // Handle other cases (e.g., null) as needed
    }
  };

  const handleCurrencyChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
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
      await addNewTerm(formData);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully added a new term.",
        showConfirmButton: false,
        icon: CheckIcon,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        timer: 2000,
      })
      setFormData({
        logo: "",
        bankName: "",
        minAmount: 0,
        interestRate: 0,
        term: "",
        index: 0,
      });
      window.history.back();
    } catch (error) {
      console.error(error);
      customModal({
        showModal,
        title: "Error!",
        text: "There was an error adding the new term. Please try again.",
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
                htmlFor="bankName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bank Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  autoComplete="bankName"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="term"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Terms(e.g 24 Months or 1 Year)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="term"
                  id="term"
                  value={formData.term}
                  onChange={handleChange}
                  autoComplete="term"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="minAmount"
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
                  name="minAmount"
                  placeholder="0.00"
                  value={formData.minAmount}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    handleCurrencyChange(formattedValue, "minAmount");
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
                htmlFor="interestRate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Interest Rate
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="interestRate"
                  id="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  autoComplete="interestRate"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
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
  )
}
