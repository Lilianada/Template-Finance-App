import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTerm, getAllTerms } from '../../config/terms';
import PageHeading from '../../components/PageHeading';
import Cards from './Cards';

export default function FixedTerms() {
    const [terms, setTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const navigate = useNavigate();
    
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
      setTerms((terms) => terms.filter((term) => term.id !== selectedTermId));
    } catch (error) {
      console.error("Failed to delete Bond:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedTerm(null); 
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
