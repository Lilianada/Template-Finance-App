import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DotLoader from "../../../components/DotLoader";
import { getUserKyc } from "../../../config/user";

export default function ClientKYC() {
  const location = useLocation();
  const navigate = useNavigate();
  const [kycDetails, setKycDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const initialUser = location.state.viewUser;
  const [user, setUser] = useState(initialUser || {});
  const {
    uid,
  } = user;

  const fetchKycDetails = async () => {
    setIsLoading(true);
    try {
      const details = await getUserKyc(user.uid);
      setKycDetails(details);
      console.log("KYC details:", details);
    } catch (error) {
      console.error("Error fetching KYC details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKycDetails();
  }, []); 

  const handleEdit = (user) => {
    navigate(`/dashboard/registered_users/view/edit_kyc/${user}`, {
      state: { editKyc: kycDetails },
    });
  };

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="text-left">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Know Your Customer (KYC)
        </h3>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          View and edit KYC details. {user.uid}
        </p>
      </div>
      {kycDetails === null || kycDetails.length === 0 ? (
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleEdit(user.uid)}
          >
            Add KYC
          </button>
        </div>
      ) : (
        <div className="mt-6 border-t border-gray-100">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Primary Purpose
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.primaryPurpose || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Trading Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.tradingExperience || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Planned Investments
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.plannedInvestments &&
                kycDetails.plannedInvestments.length > 0
                  ? kycDetails.plannedInvestments.join(", ")
                  : "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Investment Window
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.investmentWindow || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Stocks Investing Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.stocksExperience || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Stocks Investment Amount Last Year
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.stocksInvestment || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Crypto Investing Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.cryptoExperience || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Crypto Investment Amount Last Year
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {kycDetails.cryptoInvestment || "N/A"}
              </dd>
            </div>
            {/* Add more sections based on your KYC form structure */}
          </dl>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => handleEdit(user.uid)}
            >
              Edit KYC
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
