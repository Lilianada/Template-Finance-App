import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../components/PageHeading";
import { getAllBonds } from "../../config/bonds";
import Cards from "./Cards";

export default function Bonds() {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  //Function to fetch bonds
  const fetchBonds = async () => {
    try {
      setIsLoading(true);
      const fetchedBonds = await getAllBonds();
      if (!fetchedBonds) {
        return;
      }
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

  return (
    <div >
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
        refreshBonds={fetchBonds}
      />
    </div>
  );
}
