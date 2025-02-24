import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../components/PageHeading";
import { getAllIpos } from "../../config/ipos";
import Cards from "./Card";

export default function Ipos() {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    try {
      setIsLoading(true);
      const results = await getAllIpos();
      if (!results) {
        return;
      }
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

  return (
    <div>
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
        refreshBonds={fetchIpos}
      />
    </div>
  );
}
