import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { updateBond } from "../../config/bonds";
import DotLoader from "../../components/DotLoader";
import { formatNumber } from "../../config/utils";
import { useLocation } from 'react-router-dom';

export default function Edit() {
  const location = useLocation();
  const { bondToEdit } = location.state || {}; 

  const [formData, setFormData] = useState({ ...bondToEdit, imagePreview: "" });
  const [loading, setLoading] = useState(false);
  const [isPerpetual, setIsPerpetual] = useState(false);

  useEffect(() => {
    setFormData({
      ...bondToEdit,
      image: bondToEdit.image,
    });
  }, [bondToEdit]);

  useEffect(() => {
    const fetchData = async () => {
      // Ensure formData and formData.image exist
      if (formData && formData.image && formData.image.startsWith("gs://")) {
        const storage = getStorage();
        const imageRef = ref(storage, formData.image);

        try {
          const downloadURL = await getDownloadURL(imageRef);
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: downloadURL, // Set the existing image URL
          }));
        } catch (error) {
          console.error("Error fetching download URL:", error);
        }
      } else if (formData) {
        // Image URL is already a downloadable URL or formData.image does not exist
        setFormData((prevFormData) => ({
          ...prevFormData,
        }));
      }
    };

    if (bondToEdit) fetchData();
  }, [bondToEdit]);

  useEffect(() => {
    setIsPerpetual(formData.maturityDate === "Perpetual");
  }, [formData.maturityDate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (files.length > 0) {
        const selectedFile = files[0];
        // For previewing the image, create a URL for the selected file
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            imagePreview: reader.result,
          }));
        };
        reader.readAsDataURL(selectedFile);

        // Assume handleUploadImage is a function to upload the image to your server
        // and get back a URL for the uploaded image
        handleUploadImage(selectedFile)
          .then((downloadURL) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: downloadURL, // Here you might want to update with the URL from the server
            }));
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    } // Handle changes for maturityDate select dropdown
    else if (name === "maturityDate" && value === "Perpetual") {
      setIsPerpetual(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        maturityDate: "Perpetual",
      }));
    } else if (name === "maturityDate") {
      setIsPerpetual(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        maturityDate: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleUploadImage = async (imageFile) => {
    if (imageFile instanceof File) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);

      try {
        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
        throw error;
      }
    } else if (typeof imageFile === "string") {
      // Image is already a URL, no need to re-upload
      return imageFile;
    } else {
      return null;
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
    setLoading(true);
    const originalImageData = bondToEdit.image;
    try {
      let updatedFormData = { ...formData };
      if (formData.image instanceof File) {
        const imageUrl = await handleUploadImage(formData.image);
        updatedFormData.image = imageUrl;
      } else if (!formData.image) {
        updatedFormData.image = originalImageData;
      }

      await updateBond(updatedFormData.id, updatedFormData);
      // Swal.fire({
      //   icon: "success",
      //   title: "Updated!",
      //   text: `Bond has been updated.`,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Swal.fire({
      //   icon: "error",
      //   title: "Error!",
      //   text: `Error updating bond: ${error}`,
      //   showConfirmButton: true,
      //   timer: 2000,
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="m-2">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 text-left">
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Edit Bond
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Confirm the details before saving the bond.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {formData.image ? (
                  <img
                    src={formData.imagePreview || "defaultImageURL"}
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
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => document.getElementById("file").click()}
                >
                  Change
                </button>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="issuerName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Issuer Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="issuerName"
                  id="issuerName"
                  value={formData.issuerName}
                  onChange={handleChange}
                  autoComplete="issuerName"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="companyWebsite"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Company Website
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="companyWebsite"
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  autoComplete="companyWebsite"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Type
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="sector"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Sector
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="sector"
                  id="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  autoComplete="sector"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="isin"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ISIN
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="isin"
                  id="isin"
                  value={formData.isin}
                  onChange={handleChange}
                  autoComplete="isin"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="minimumAmount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Minimum Amount
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="minimumAmount"
                  id="minimumAmount"
                  value={formatNumber(formData.minimumAmount)}
                  onChange={(e) =>
                    handleCurrencyChange(e.target.value, "minimumAmount")
                  }
                  autoComplete="minimumAmount"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  aria-describedby="price-currency"
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
                htmlFor="currentValue"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Current Value
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="currentValue"
                  id="currentValue"
                  value={formData.currentValue}
                  onChange={handleChange}
                  autoComplete="currentValue"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="couponFrequency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Coupon Frequency
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="couponFrequency"
                  id="couponFrequency"
                  value={formData.couponFrequency}
                  onChange={handleChange}
                  autoComplete="couponFrequency"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="tyquantitype"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Quantity
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  autoComplete="quantity"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="couponRate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Coupon Rate
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="couponRate"
                  id="couponRate"
                  value={formData.couponRate}
                  onChange={handleChange}
                  autoComplete="couponRate"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="maturityDate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Maturity Date
              </label>
              <div className="mt-2">
                <select
                  id="maturityDate"
                  name="maturityDate"
                  className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.maturityDate}
                  onChange={handleChange}
                >
                  <option value="Date">Date</option>
                  <option value="Perpetual">Perpetual</option>
                </select>
              </div>
            </div>

            {!isPerpetual && (
              <div className="sm:col-span-3">
                <label
                  htmlFor="maturityDate"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="maturityDate"
                    id="maturityDate"
                    value={formData.maturityDate || ""}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSubmit}
        >
          {loading ? <DotLoader /> : "Save"}
        </button>
      </div>
    </form>
  );
}
