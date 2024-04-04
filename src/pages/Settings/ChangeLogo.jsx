import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../../config/firebase";
import { useModal } from "../../context/ModalContext";
import {
  CheckIcon,
  ExclamationCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { customModal } from "../../config/modalUtils";
import DotLoader from "../../components/DotLoader";

export default function ChangeLogo() {
  const { showModal } = useModal();
  const [initialFaviconUrl, setInitialFaviconUrl] = useState(null);
  const [initialWhiteLogoUrl, setInitialWhiteLogoUrl] = useState(null);
  const [initialDarkLogoUrl, setInitialDarkLogoUrl] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState(null);
  const [whiteLogoUrl, setWhiteLogoUrl] = useState(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch an image from Firebase Storage
  const fetchImage = async (imageRef, setImageUrl, setInitialImageUrl) => {
    try {
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      setInitialImageUrl(url);
    } catch (error) {
      console.error("Error fetching image:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    fetchImage(
      ref(storage, "gs://cvs-online.appspot.com/logos/favicon/"),
      setFaviconUrl,
      setInitialFaviconUrl
    );
    fetchImage(
      ref(storage, "gs://cvs-online.appspot.com/logos/whiteLogo/"),
      setWhiteLogoUrl,
      setInitialWhiteLogoUrl
    );
    fetchImage(
      ref(storage, "gs://cvs-online.appspot.com/logos/darkLogo/"),
      setDarkLogoUrl,
      setInitialDarkLogoUrl
    );
  }, []);

  const handleImageChange = (event, setImageUrl) => {
    const { type, files } = event.target;

    if (type === "file" && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async (e, imageRef, setImageUrl, image) => {
    e.preventDefault();

    if (!image) {
      return;
    }

    const uploadTask = uploadBytes(imageRef, image);
    setIsLoading(true);

    try {
      await uploadTask;
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      customModal({
        showModal,
        title: "Image Updated",
        text: "Your image has been updated successfully",
        showConfirmButton: false,
        iconBgColor: "bg-green-500",
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
        iconBgColor: "bg-green-500",
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
    <div className="">
      <form action="#" method="POST" onSubmit={handleImageUpload}>
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

            <div className="col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Favicon
              </label>
              <div className="mt-2 mb-8 flex items-center">
                <span className="grid place-items-center rounded-md h-14 w-14 overflow-hidden bg-gray-100">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="Favicon" />
                  ) : (
                    <PhotoIcon
                      className="h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  name="favicon"
                  id="favicon"
                  onChange={(e) => handleImageChange(e, setFaviconUrl)}
                  className="hidden"
                />
                <label
                  htmlFor="favicon"
                  className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  Choose file
                </label>
                <button
                  type="button"
                  onClick={() => revertImage(setFaviconUrl, initialFaviconUrl)}
                  className="ml-3 px-3 py-1.5 rounded-md bg-gray-200 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Revert
                </button>
              </div>
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                White/Transaparent Logo
              </label>
              <div className="mt-2 mb-8 flex items-center">
                <span className="grid place-items-center rounded-md h-14 w-14 overflow-hidden bg-gray-100">
                  {whiteLogoUrl ? (
                    <img src={whiteLogoUrl} alt="White Logo" />
                  ) : (
                    <PhotoIcon
                      className="h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  name="whiteLogo"
                  id="whiteLogo"
                  onChange={(e) => handleImageChange(e, setWhiteLogoUrl)}
                  className="hidden"
                />
                <label
                  htmlFor="whiteLogo"
                  className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  Choose file
                </label>
                <button
                  type="button"
                  onClick={() =>
                    revertImage(setWhiteLogoUrl, initialWhiteLogoUrl)
                  }
                  className="ml-3 px-3 py-1.5 rounded-md bg-gray-200 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Revert
                </button>
              </div>
            </div>

            <div className="col-span-3">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Dark Logo
              </label>
              <div className="mt-2 mb-8 flex items-center">
                <span className="grid place-items-center rounded-md h-14 w-14 overflow-hidden bg-gray-100">
                  {darkLogoUrl ? (
                    <img src={darkLogoUrl} alt="dark Logo" />
                  ) : (
                    <PhotoIcon
                      className="h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  name="darkLogo"
                  id="darkLogo"
                  onChange={(e) => handleImageChange(e, setDarkLogoUrl)}
                  className="hidden"
                />
                <label
                  htmlFor="darkLogo"
                  className="ml-5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                >
                  Choose file
                </label>
                <button
                  type="button"
                  onClick={() =>
                    revertImage(setDarkLogoUrl, initialDarkLogoUrl)
                  }
                  className="ml-3 px-3 py-1.5 rounded-md bg-gray-200 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Revert
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
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
                "Save Images"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
