import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../../context/ModalContext";
import { deleteUserIpo, getUserIpos } from "../../../../config/ipos";
import { customModal } from "../../../../config/modalUtils";
import LoadingScreen from "../../../../components/LoadingScreen";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../config/utils";
import EditUserIpos from "./Edit";
import { deleteTermFromUserCollection, getAllTerms } from "../../../../config/terms";

export default function ClientTermPage() {
    const { showModal, hideModal } = useModal();
  const [fixedTerms, setFixedTerms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    async function fetchTerms() {
      try {
        setIsLoading(true);
        const fetchedTerms = await getAllTerms();
        setFixedTerms(fetchedTerms);
      } catch (error) {
        console.error("Error fetching Terms:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTerms();
  }, []);

  const handleEdit = async (term) => {
    setOpen(true);
    setSelectedId(term);
  }

  const handleDelete = () => {
    customModal({
      showModal,
      title: "Are you sure?",
      text: `You are about to delete this term investment. This action cannot be undone.`,
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
      await deleteTermFromUserCollection(selectedId);
      customModal({
        showModal,
        title: "Success",
        text: "You have successfully deleted this term.",
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
        text: "There was an error deleting this term. Please try again.",
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
