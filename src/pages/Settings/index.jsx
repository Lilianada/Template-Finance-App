import React, { useState } from "react";
import {
  KeyIcon,
  LockClosedIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import GeneralSettings from "./GeneralSettings";
import AddNewAdmin from "./AdminUsers";
import ChangeMetaData from "./ChangeMeta";
import ChangePassword from "./ChangePasswordTab";
import ChangeLogo from "./ChangeLogo";

const navigation = [
  {
    name: "Change Logo",
    href: "changeLogo",
    icon: CameraIcon,
    current: true,
  },
  { name: "Change Meta", href: "changeMeta", icon: KeyIcon, current: false },
  {
    name: "Change Password",
    href: "changePassword",
    icon: LockClosedIcon,
    current: false,
  },
  {
    name: "Client App Setting",
    href: "generalSetting",
    icon: WrenchScrewdriverIcon,
    current: false,
  },
  {
    name: "Add New Admin",
    href: "addAdmin",
    icon: UserIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("changeLogo");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <main className="mx-auto max-w-7xl pb-10 lg:px-8 lg:py-12">
      <div className="sm:grid sm:grid-cols-12 sm:gap-x-5">
        <aside className="px-2 py-6 lg:col-span-3 lg:px-0 lg:py-0">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                onClick={() => handleTabClick(item.href)}
                className={classNames(
                  item.href === activeTab
                    ? "bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700"
                    : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
                )}
                aria-current={item.href === activeTab ? "page" : undefined}
              >
                <item.icon
                  className={classNames(
                    item.href === activeTab
                      ? "text-indigo-500 group-hover:text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-1 mr-3 h-6 w-6 flex-shrink-0 hover:text-indigo-500"
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:col-span-9 sm:col-span-10 lg:px-0 text-left sm:mt-4">
          {activeTab === "changeLogo" && <ChangeLogo />}
          {activeTab === "changePassword" && <ChangePassword />}
          {activeTab === "changeMeta" && <ChangeMetaData />}
          {activeTab === "generalSetting" && <GeneralSettings />}
          {activeTab === "addAdmin" && <AddNewAdmin />}
        </div>
      </div>
    </main>
  );
}
