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
      {/* Portfolio Information */}
      <AccountOverview initialUser={initialUser}/>

      {/* Client Information */}
      <ClientInfo initialUser={initialUser} />


      {/* Client KYC */}
      <ClientKyc initialUser={initialUser}/>

      {/* Banking Details */}
      <BankDetails initialUser={initialUser}/>

      {/* Client Documents */}
      <ClientDoc initialUser={initialUser}/>
    </>
  );
}
