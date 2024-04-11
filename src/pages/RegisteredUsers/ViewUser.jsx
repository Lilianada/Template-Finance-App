import React from "react";
import { useLocation } from "react-router-dom";
import ClientInfo from "./ClientInfo";
import AccountOverview from "./ClientAccountOverview/index";
import ClientKyc from "./KYC";
import BankDetails from "./BankDetails";
import ClientDoc from "./ClientDoc";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ViewUser() {
  const location = useLocation();
  const initialUser = location.state.viewUser;

  return (
    <>
      <div className="sm:flex sm:items-start mt-4">
        <div className="sm:flex-auto text-left">
          <div className="flex gap-2 items-center cursor-pointer">
            <ArrowLeftIcon
              className="h-5 w-5 stroke-gray-900"
              onClick={() => window.history.back()}
            />
            <p className="text-gray-800 font-semibold">Back</p>
          </div>
        </div>
      </div>
      {/* Portfolio Information */}
      <AccountOverview initialUser={initialUser} />

      {/* Client Information */}
      <ClientInfo initialUser={initialUser} />

      {/* Client Documents */}
      <ClientDoc initialUser={initialUser} />

      {/* Client KYC */}
      <ClientKyc initialUser={initialUser} />

      {/* Banking Details */}
      <BankDetails initialUser={initialUser} />
    </>
  );
}
