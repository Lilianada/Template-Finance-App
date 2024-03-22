import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../components/PageHeading";
import { deleteBond, getAllBonds } from "../../config/bonds";
import Cards from "./Cards";

export default function Bonds() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBondId, setSelectedBondId] = useState(null);
  const navigate = useNavigate();

  //Function to fetch bonds
  const fetchBonds = async () => {
    try {
      setIsLoading(true);
      const fetchedBonds = await getAllBonds();
      setBonds(fetchedBonds);
    } catch (error) {
      console.error("Error fetching bonds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonds();
  }, []);

  const handleEdit = (bond) => {
    navigate(`/dashboard/bonds/edit/${bond.id}`, {
      state: { bondToEdit: bond },
    });
  };


  const handleDelete = (bondId) => {
    setSelectedBondId(bondId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBond(selectedBondId);
      setBonds((bonds) => bonds.filter((bond) => bond.id !== selectedBondId));
    } catch (error) {
      console.error("Failed to delete Bond:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setSelectedBondId(null); // Reset the selected bond ID
    }
  };

  return (
    <div>
      <PageHeading
        title="Add new bond"
        onclick="/dashboard/bonds/add"
        placeholder="Search bonds"
        search={true}
        sort={true}
      />
      <Cards
        bonds={bonds}
        handleEdit={handleEdit}
        isLoading={isLoading}
        handleDelete={handleDelete}
        confirmDelete={confirmDelete}
        isDeleteModalOpen={isDeleteModalOpen}
      />
    </div>
  );
}
