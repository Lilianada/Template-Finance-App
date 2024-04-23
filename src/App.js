import React, { useEffect } from "react";
import { db } from "./config/firebase";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { checkAdminRoleAndLogoutIfNot } from "./config/utils";
import { useAuth } from "./utils/authState";
import { ModalProvider } from "./context/ModalContext";
import { AlertProvider } from "./context/AlertContext";
import store from "../src/store/store";
import Skeleton from "./components/Skeleton";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./utils/protectedRoutes";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import LoadingScreen from "./components/LoadingScreen";
import Bonds from "./pages/Bonds";
import AddBond from "./pages/Bonds/Add";
import EditBond from "./pages/Bonds/Edit";
import Dashboard from "./pages/Dashboard";
import RegisteredUsers from "./pages/RegisteredUsers";
import AddNewUser from "./pages/RegisteredUsers/AddUser";
import ViewUser from "./pages/RegisteredUsers/ViewUser";
import Edit from "./pages/RegisteredUsers/ClientInfo/Edit";
import EditKyc from "./pages/RegisteredUsers/KYC/edit";
import EditBankDetails from "./pages/RegisteredUsers/BankDetails/Edit";
import ClientCashPage from "./pages/RegisteredUsers/ClientAccountOverview/ClientCashBalance";
import EditPortfolio from "./pages/RegisteredUsers/ClientAccountOverview/ClientCashBalance/Edit";
import AddCashBalance from "./pages/RegisteredUsers/ClientAccountOverview/ClientCashBalance/Add";
import ClientBondsPage from "./pages/RegisteredUsers/ClientAccountOverview/ClientBonds";
import EditBondsDetails from "./pages/RegisteredUsers/ClientAccountOverview/ClientBonds/Edit";
import AddUserBonds from "./pages/RegisteredUsers/ClientAccountOverview/ClientBonds/Add";
import BondCards from "./pages/RegisteredUsers/ClientAccountOverview/ClientBonds/BondCards";
import Ipos from "./pages/Ipos";
import AddIpos from "./pages/Ipos/Add";
import EditIpos from "./pages/Ipos/Edit";
import RequestsTable from "./pages/UsersRequests";
import ClientIposPage from "./pages/RegisteredUsers/ClientAccountOverview/ClientIpos";
import IposCards from "./pages/RegisteredUsers/ClientAccountOverview/ClientIpos/IposCards";
import FixedTerms from "./pages/FixedTerm";
import AddFixedTerm from "./pages/FixedTerm/Add";
import EditFixedTerm from "./pages/FixedTerm/Edit";
import FixedTermCards from "./pages/RegisteredUsers/ClientAccountOverview/ClientTerms/FixedTermsCard";
import ClientTermPage from "./pages/RegisteredUsers/ClientAccountOverview/ClientTerms";
import ClientStock from "./pages/RegisteredUsers/ClientAccountOverview/ClientStock";
import AddUserStock from "./pages/RegisteredUsers/ClientAccountOverview/ClientStock/Add";
import EditUserStock from "./pages/RegisteredUsers/ClientAccountOverview/ClientStock/Edit";
import Settings from "./pages/Settings";
import BondsRequests from "./pages/BondsRequest";
import Notifications from "./pages/Notifications";
import IposRequests from "./pages/IposRequest";
import FixedTermRequests from "./pages/FixedTermRequest";
import Chat from "./pages/Chat";
import ChangePassword from "./pages/Auth/ChangePassword";

function App() {
  const { loadingAuthState } = useAuth();

  useEffect(() => {
    checkAdminRoleAndLogoutIfNot(db);
  }, []);

  return (
    <ModalProvider>
      <AlertProvider>
      <Provider store={store}>
        <div className="App">
          <Router>
            <Routes>
              <Route
                path="/dashboard/"
                element={
                  <ProtectedRoute>
                    <Skeleton />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users"
                  element={
                    <ProtectedRoute>
                      <RegisteredUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="add_new_user"
                  element={
                    <ProtectedRoute>
                      <AddNewUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/:userId"
                  element={
                    <ProtectedRoute>
                      <ViewUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/edit/:userId"
                  element={
                    <ProtectedRoute>
                      <Edit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_kyc/:userId"
                  element={
                    <ProtectedRoute>
                      <EditKyc />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_bank_details/:userId"
                  element={
                    <ProtectedRoute>
                      <EditBankDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientCashPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/add_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <AddCashBalance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_cash_details/:userId"
                  element={
                    <ProtectedRoute>
                      <EditPortfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_bonds_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientBondsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_bonds/:userId"
                  element={
                    <ProtectedRoute>
                      <BondCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/add_user_bond/:userId"
                  element={
                    <ProtectedRoute>
                      <AddUserBonds />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/edit_user_bond/:userId"
                  element={
                    <ProtectedRoute>
                      <EditBondsDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_ipos_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientIposPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_ipos/:userId"
                  element={
                    <ProtectedRoute>
                      <IposCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds"
                  element={
                    <ProtectedRoute>
                      <Bonds />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds/add"
                  element={
                    <ProtectedRoute>
                      <AddBond />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds/edit/:bondId"
                  element={
                    <ProtectedRoute>
                      <EditBond />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="ipos"
                  element={
                    <ProtectedRoute>
                      <Ipos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="ipos/add"
                  element={
                    <ProtectedRoute>
                      <AddIpos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="ipos/edit/:iposId"
                  element={
                    <ProtectedRoute>
                      <EditIpos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="fixed_term_deposits"
                  element={
                    <ProtectedRoute>
                      <FixedTerms />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="fixed_term_deposits/add"
                  element={
                    <ProtectedRoute>
                      <AddFixedTerm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="fixed_term_deposits/edit/:termId"
                  element={
                    <ProtectedRoute>
                      <EditFixedTerm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_terms_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientTermPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_fixed_terms/:userId"
                  element={
                    <ProtectedRoute>
                      <FixedTermCards />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_stocks_details/:userId"
                  element={
                    <ProtectedRoute>
                      <ClientStock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_stocks_details/add_stock/:userId"
                  element={
                    <ProtectedRoute>
                      <AddUserStock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="registered_users/view/view_stocks_details/edit_stock/:userId"
                  element={
                    <ProtectedRoute>
                      <EditUserStock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="user_requests"
                  element={
                    <ProtectedRoute>
                      <RequestsTable />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="bonds_requests"
                  element={
                    <ProtectedRoute>
                      <BondsRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="ipos_requests"
                  element={
                    <ProtectedRoute>
                      <IposRequests />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="fixedTerms_requests"
                  element={
                    <ProtectedRoute>
                      <FixedTermRequests />
                    </ProtectedRoute>
                  }
                />
              <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              <Route
                  path="notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
              <Route
                  path="chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="/" index element={<Login />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>
          {loadingAuthState && <LoadingScreen />}
        </div>
      </Provider>
      </AlertProvider>
    </ModalProvider>
  );
}

export default App;
