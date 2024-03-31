import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTerms } from '../../config/terms';
import PageHeading from '../../components/PageHeading';
import Cards from './Cards';

export default function FixedTerms() {
    const [terms, setTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
    navigate(`/dashboard/fixed_term_deposits/edit/${term.id}`, {
      state: { termToEdit: term },
    });
  };


  return (
    <div>
      <PageHeading
        title="Add new Fixed Term Deposit"
        onclick="/dashboard/fixed_term_deposits/add"
        placeholder="Search bonds"
        search={true}
        sort={true}
      />
      <Cards
        fixedTerms={terms}
        handleEdit={handleEdit}
        isLoading={isLoading}
        refreshTerms={fetchTerms}
      />
    </div>
  )
}
