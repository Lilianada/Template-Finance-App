import React, { useState } from "react";
import {
  Bars3Icon,
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
    name: "Bonds",
    to: "/dashboard/bonds",
    icon: DocumentChartBarIcon,
    current: false,
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
    current: false,
  },
];

const requests = [
  {
    id: 1,
    name: "Users Request",
    to: "/dashboard/user_requests",
    initial: "U",
    current: false,
  },
  {
    id: 1,
    name: "Bonds Request",
    to: "/dashboard/bonds_requests",
    initial: "B",
    current: false,
  },
  {
    id: 2,
    name: "Ipos Request",
    to: "/dashboard/ipos_requests",
    initial: "I",
    current: false,
  },
  {
    id: 3,
    name: "Fixed Term Requests",
    to: "/dashboard/fixedTerms_requests",
    initial: "F",
    current: false,
  },
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
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
