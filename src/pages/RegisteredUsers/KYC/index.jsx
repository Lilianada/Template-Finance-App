import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserKyc } from "../../../config/user";
import DotLoader from "../../../components/DotLoader";

export default function ClientKYC({ initialUser }) {
  const navigate = useNavigate();
  const [kycDetails, setKycDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchKycDetails = async () => {
    setIsLoading(true);
    try {
      const details = await getUserKyc(initialUser.uid);
      setKycDetails(details);
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

  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
      <div className="text-left">
        <h3 className="text-lg font-semibold leading-7 text-gray-900">
          Know Your Customer (KYC)
        </h3>
      </div>
      {isLoading && <DotLoader />}
      {kycDetails === null || kycDetails.length === 0 ? (
        <div className="w-full grid place-items-center rounded-xl border border-gray-200 p-4 mt-8">
          <h5 className="text-gray-400 text-lg">
            NO KYC INFO HAS BEEN ADDED YET.
          </h5>
        </div>
      ) : (
        <div className="mt-6 border-t border-gray-100 text-left">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 mt-4">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Primary Purpose
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.purpose}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Planned Investments
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.investments}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Investment Window
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.investWindow}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Investment Strategy
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.investStrategy}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Stocks Investing Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.stockExperience}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Stocks Investment Amount Last Year
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.stocksInvestment}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Crypto Investing Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.cryptoExperience}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Crypto Investment Amount Last Year
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.cryptoInvestment}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Leverage Investments
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.leverageExperience}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Leverage Investments Amount
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.leverageInvestments}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Trading Experience
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.tradeExperience}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Trading Education Experience
              </dt>
              <ul>
                {kycDetails.eduExperience &&
                kycDetails.eduExperience.length > 0 ? (
                  kycDetails.eduExperience.map((item, index) => (
                    <li key={index} className="list-disc ml-4">
                      <dd className="mt-1 text-sm text-gray-500" key={index}>
                        {item}
                      </dd>
                    </li>
                  ))
                ) : (
                  <dd className="mt-1 text-sm text-gray-500">N/A</dd>
                )}
              </ul>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Trading Knowledge Assessment
              </dt>
              <ul>
                {kycDetails.tradeKnowledge &&
                kycDetails.tradeKnowledge.length > 0 ? (
                  kycDetails.tradeKnowledge.map((item, index) => (
                    <li key={index} className="list-disc ml-4">
                      <dd className="mt-1 text-sm text-gray-500 truncate">
                        {item}
                      </dd>
                    </li>
                  ))
                ) : (
                  <dd className="mt-1 text-sm text-gray-500">N/A</dd>
                )}
              </ul>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Trading Strategy
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.tradeStrategy || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Purpose of Trading
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.purposeTrading || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Investment Amount
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.investAmount || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Risk Reward Scenarios
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.risk ? kycDetails.risk.name : "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Family Assessment
              </dt>
              <ul>
                {kycDetails.familyAssessment &&
                kycDetails.familyAssessment.length > 0 ? (
                  kycDetails.familyAssessment.map((family, index) => (
                    <li key={index} className="list-disc ml-4">
                      <dd className="mt-1 text-sm text-gray-500">
                        {family || "N/A"}
                      </dd>
                    </li>
                  ))
                ) : (
                  <dd className="mt-1 text-sm text-gray-500">N/A</dd>
                )}
              </ul>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Financial Status
              </dt>
              <ul>
                {kycDetails.financialStats &&
                kycDetails.financialStats.length > 0 ? (
                  kycDetails.financialStats.map((stats, index) => (
                    <li key={index} className="list-disc ml-4">
                      <dd className="mt-1 text-sm text-gray-500">{stats}</dd>
                    </li>
                  ))
                ) : (
                  <dd className="mt-1 text-sm text-gray-500">N/A</dd>
                )}
              </ul>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Source of Income
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.job || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Employer Details
              </dt>
              <dd className="mt-1 text-sm text-gray-500 truncate">
                {kycDetails.employerDets || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Annual Net Income
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.netIncome || "N/A"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-900">
                Total Cash and Liquid Assets (USD)
              </dt>
              <dd className="mt-1 text-sm text-gray-500">
                {kycDetails.assets || "N/A"}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900"
              onClick={() => handleEdit(initialUser.uid)}
            >
              Edit KYC
            </button>
          </div>
        </div>
      )}
      {kycDetails === null && (
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            onClick={() => handleEdit(initialUser.uid)}
          >
            Add KYC
          </button>
        </div>
      )}
    </div>
  );
}
