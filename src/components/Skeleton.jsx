import React, { useState } from "react";
import {
  Bars3Icon,
  BanknotesIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  CreditCardIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "Registered Users",
    to: "/dashboard/registered_users",
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: "Cash Deposits",
    to: "/dashboard/cash_deposits",
    icon: BanknotesIcon,
    current: false,
  },
  { 
    name: "Bonds", 
    to: "/dashboard/bonds", 
    icon: DocumentChartBarIcon, 
    current: false 
  },
  {
    name: "Fixed Term Deposits",
    to: "/dashboard/fixed_term_deposits",
    icon: CreditCardIcon,
    current: false,
  },
  { 
    name: "Ipos", 
    to: "/dashboard/ipos", 
    icon: CalendarIcon, 
    current: false 
  },
];

const requests = [
  { id: 1, name: "Users Request", to: "/dashboard/user_requests", initial: "U", current: false },
  { id: 1, name: "Bonds Request", to: "/dashboard/bonds_requests", initial: "B", current: false },
  { id: 2, name: "Ipos Request", to: "#", initial: "I", current: false },
  { id: 3, name: "Fixed Term Requests", to: "#", initial: "F", current: false, },
  { id: 4, name: "Transaction Requests", to: "/dashboard/transactions_requests", initial: "T", current: false, },
];

export default function Skeleton() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          requests={requests}
        />

        <div className="lg:pl">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 "
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            {/* Header */}
            <Header />
          </div>

          <main className="pt-4 lg:pt-8 pb-10 lg:mx-4 sm:mx-6">
            <div className="px-2">
              {/* <div className="pb-8">
                  <nav className="sm:hidden" aria-label="Back">
                    <Link
                      to="#"
                      className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <ChevronLeftIcon
                        className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      Back
                    </Link>
                  </nav>
                  <nav className="hidden sm:flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                      <li>
                        <div className="flex">
                          <Link
                            to="#"
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Jobs
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <ChevronRightIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <Link
                            to="#"
                            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Engineering
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <ChevronRightIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <Link
                            to="#"
                            aria-current="page"
                            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                          >
                            Back End Developer
                          </Link>
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div> */}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
