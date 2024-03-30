import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { PencilIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { customModal } from '../../config/modalUtils';
import { deleteIpos } from '../../config/terms';
import LoadingScreen from '../../components/LoadingScreen';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Cards({fixedTerms, isLoading, handleEdit, refreshTerms}) {
    console.log(fixedTerms)
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showModal, hideModal} = useModal();
    const [selectedTerms, setSelectedTerm] = useState(null)
    const sortedTerms = [...fixedTerms].sort((a, b) => a.index - b.index);
  
    const handleDelete = () => {
      customModal({
        showModal,
        title: "Are you sure?",
        text: `You are about to delete this bond investment. This action cannot be undone.`,
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
        console.log(selectedTerms)
        await deleteIpos(selectedTerms);
        customModal({
          showModal,
          title: "Success",
          text: "You have successfully deleted this bond.",
          showConfirmButton: false,
          icon: CheckIcon,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          timer: 2000,
        });
        setOpen(false);
        refreshTerms();
      } catch (error) {
        customModal({
          showModal,
          title: "Error!",
          text: "There was an error deleting this bond. Please try again.",
          showConfirmButton: false,
          icon: ExclamationTriangleIcon,
          iconBgColor: "bg-red-100",
          iconTextColor: "text-red-600",
          buttonBgColor: "bg-red-600",
          timer: 2000,
        });
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    };
  
    if (isDeleting) {
      <LoadingScreen/>
    }
  
  return (
    <div>
      
    </div>
  )
}
