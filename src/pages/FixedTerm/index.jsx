import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTerm, getAllTerms } from '../../config/terms';
import PageHeading from '../../components/PageHeading';
import { useModal } from '../../context/ModalContext';
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Cards from './Cards';
import { customModal } from '../../config/modalUtils';

export default function FixedTerms() {
    const [terms, setTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const navigate = useNavigate();
    const { showModal } = useModal();
    
  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const fetchedTerms = await getAllTerms();
      if (!fetchedTerms) {
        return;
      }
      setTerms(fetchedTerms);
    } catch (error) {
      console.error("Error fetching terms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleEdit = (term) => {
    navigate(`/dashboard/terms/edit/${term.id}`, {
      state: { termToEdit: term },
    });
  };

  const handleDelete = (termId) => {
    setSelectedTerm(termId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTerm(selectedTermId);
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
      setTerms((terms) => terms.filter((term) => term.id !== selectedTermId));
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
      setIsLoading(false);
    }
  };
  return (
    <div>
      <PageHeading
        title="Add new Fixed Term Deposit"
        onclick="/dashboard/terms/add"
        placeholder="Search bonds"
        search={true}
        sort={true}
      />
      <Cards
        fixedTerms={terms}
        handleEdit={handleEdit}
        isLoading={isLoading}
        handleDelete={handleDelete}
        confirmDelete={confirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        refreshTerms={fetchTerms}
      />
    </div>
  )
}
