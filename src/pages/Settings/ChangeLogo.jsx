import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../../config/firebase";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { customModal } from "../../utils/modalUtils";
import DotLoader from "../../components/DotLoader";

export default function ChangeLogo() {
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const [favicon, setFavicon] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState(null);
  const [initialFaviconUrl, setInitialFaviconUrl] = useState(null);

  const [whiteLogo, setWhiteLogo] = useState(null);
  const [whiteLogoUrl, setWhiteLogoUrl] = useState(null);
  const [initialWhiteLogoUrl, setInitialWhiteLogoUrl] = useState(null);

  const [darkLogo, setDarkLogo] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);
  const [initialDarkLogoUrl, setInitialDarkLogoUrl] = useState(null);

  // Function to fetch an image from Firebase Storage
  const fetchImage = async (path, setImageUrl, setInitialImageUrl) => {
    const imageRef = ref(storage, path);
    try {
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      setInitialImageUrl(url);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage("logos/favicon/", setFaviconUrl, setInitialFaviconUrl);
    fetchImage("logos/whiteLogo/", setWhiteLogoUrl, setInitialWhiteLogoUrl);
    fetchImage("logos/darkLogo/", setDarkLogoUrl, setInitialDarkLogoUrl);
  }, []);

  const handleImageChange = (event, setImageFile, setImageUrl) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
      setImageFile(file); // Set the file to state for uploading
    }
  };

  const handleImageUpload = async (imageFile, path, setImageUrl) => {
    if (!imageFile) {
      console.error("No image file selected for upload.");
      return;
    }
    setIsLoading(true);
    const imageRef = ref(storage, path);

    try {
      await uploadBytes(imageRef, imageFile);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      customModal({
        showModal,
        title: "Image Updated",
        text: "Your image has been updated successfully",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        buttonBgColor: "bg-green-500",
        iconColor: "text-white",
        icon: CheckIcon,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      customModal({
        showModal,
        title: "Error",
        text: "An error occurred while updating your image. Please try again later.",
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const revertImage = (setUrl, initialUrl) => {
    setUrl(initialUrl);
  };

  return (
    <div className="shadow sm:overflow-hidden sm:rounded-md">
      
      <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
      <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Change Logo and Favicon
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update the logos and favicon for your app.
            </p>
          </div>
        {/* Form for Favicon */}
        <ImageUploadForm
          isLoading={isLoading}
          label="Favicon"
          image={favicon}
          imageUrl={faviconUrl}
          initialUrl={initialFaviconUrl}
          onFileChange={(e) => handleImageChange(e, setFavicon, setFaviconUrl)}
          onUpload={() =>
            handleImageUpload(favicon, "logos/favicon/", setFaviconUrl)
          }
          onRevert={() => revertImage(setFaviconUrl, initialFaviconUrl)}
        />

        {/* Form for White/Transparent Logo */}
        <ImageUploadForm
          isLoading={isLoading}
          label="White Logo"
          image={whiteLogo}
          imageUrl={whiteLogoUrl}
          initialUrl={initialWhiteLogoUrl}
          onFileChange={(e) =>
            handleImageChange(e, setWhiteLogo, setWhiteLogoUrl)
          }
          onUpload={() =>
            handleImageUpload(whiteLogo, "logos/whiteLogo/", setWhiteLogoUrl)
          }
          onRevert={() => revertImage(setWhiteLogoUrl, initialWhiteLogoUrl)}
        />

        {/* Form for Dark Logo */}
        <ImageUploadForm
          isLoading={isLoading}
          label="Dark Logo"
          image={darkLogo}
          imageUrl={darkLogoUrl}
          initialUrl={initialDarkLogoUrl}
          onFileChange={(e) =>
            handleImageChange(e, setDarkLogo, setDarkLogoUrl)
          }
          onUpload={() =>
            handleImageUpload(darkLogo, "logos/darkLogo/", setDarkLogoUrl)
          }
          onRevert={() => revertImage(setDarkLogoUrl, initialDarkLogoUrl)}
        />
      </div>
      <div className="mt-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : <DotLoader />}
        </button>
      </div>
    </div>
  );
}

/**
 * ImageUploadForm Component - abstracts repeated form elements for image uploads
 */
function ImageUploadForm({
  label,
  imageUrl,
  onFileChange,
  onUpload,
  onRevert,
}) {
  return (
    <div className="col-span-3">
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2 mb-8 flex items-center">
        <span className="grid place-items-center rounded-md h-14 w-14 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt={label} />
          ) : (
            <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
          )}
        </span>
        <input
          type="file"
          accept="image/*"
          id={label}
          onChange={onFileChange}
          className="hidden"
        />
        <label
          htmlFor={label}
          className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
        >
          Choose file
        </label>
        <button
          type="button"
          onClick={onUpload}
          className="ml-3 px-3 py-1.5 rounded-md bg-emerald-600 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Upload
        </button>
        <button
          type="button"
          onClick={onRevert}
          className="ml-3 px-3 py-1.5 rounded-md bg-red-400 text-sm font-semibold text-white shadow-sm hover:bg-red-300"
        >
          Revert
        </button>
      </div>
    </div>
  );
}
