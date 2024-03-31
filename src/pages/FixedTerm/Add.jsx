import React, { useState } from 'react'
import { addNewTerm } from '../../config/terms';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { customModal } from '../../config/modalUtils';
import { useModal } from '../../context/ModalContext';
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
    <div>
      
    </div>
  )
}
