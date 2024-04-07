import React from "react";
import { useLocation } from "react-router-dom";
import ClientInfo from "./ClientInfo";
import AccountOverview from "./ClientAccountOverview/index";
import ClientKyc from "./KYC";
import BankDetails from "./BankDetails";
import ClientDoc from "./ClientDoc";

export default function ViewUser() {
  const location = useLocation();
  const initialUser = location.state.viewUser;

  return (
    <>
      {/* Client Information */}
      <ClientInfo initialUser={initialUser} />

      {/* Client Documents */}
      <ClientDoc initialUser={initialUser}/>

      {/* Client KYC */}
      <ClientKyc initialUser={initialUser}/>

      {/* Banking Details */}
      <BankDetails initialUser={initialUser}/>

      {/* Portfolio Information */}
      <AccountOverview initialUser={initialUser}/>
    </>
  );
}
