import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../components/PageHeading";
import { deleteIpos, getAllIpos } from "../../config/ipos";
import Cards from "./Cards";

export default function Ipos() {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIposId, setSelectedIposId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIpos();
  });

  const fetchIpos = async () => {
    try {
      setIsLoading(true);
      const results = await getAllIpos();
      setIpos(results);
    } catch (err) {
      console.error("Error fetching ipos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (ipos) => {
    navigate(`/dashboard/ipos/edit/${ipos.id}`, {
      state: { iposToEdit: ipos },
    });
  };

  const handleDelete = (iposId) => {
    setSelectedIposId(iposId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteIpos(selectedIposId);
      setIpos((ipos) => ipos.filter((ipos) => ipos.id !== selectedIposId));
    } catch (error) {
      console.error("Failed to delete Ipos:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedIposId(null); 
    }
  };
 

  return <div>
    <PageHeading
        title="Add New Ipos"
        onclick="/dashboard/ipos/add"
        search={true}
        sort={true}
    />
    <Cards
        ipos={ipos}
        handleEdit={handleEdit}
        isLoading={isLoading}
        handleDelete={handleDelete}
        confirmDelete={confirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
        refreshBonds={fetchIpos}
      />
  </div>;
}
