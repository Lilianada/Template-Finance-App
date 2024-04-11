import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import CustomModal from "./CustomModal";
import { auth } from "../config/firebase";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <div className="relative flex flex-1 items-center justify-center">
        <h1 className="hidden md:block md:text-2xl text-sm font-semibold leading-6 text-gray-900 ">
          CVS Investment Management
        </h1>
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <Link
          to="/dashboard/notifications"
          className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </Link>

        {/* Separator */}
        <div className="block h-6 w-px bg-gray-900/10" aria-hidden="true" />

        {/* Profile dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            <span className="flex items-center">
              <span
                className="text-sm font-semibold leading-6 text-gray-900"
                aria-hidden="true"
              >
                Admin desk
              </span>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/dashboard/settings"
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenModal(true)}
                    className={classNames(
                      active ? "bg-gray-50 w-full" : "",
                      "block px-3 py-1 text-sm leading-6 text-red-700 w-full text-left"
                    )}
                  >
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
        <CustomModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Signout"
          description="Are you sure you want to sign out of your account?"
          showConfirmButton={true}
          confirmButtonText="Sign Out"
          cancelButtonText="Cancel"
          confirmButtonBgColor="bg-red-600"
          confirmButtonTextColor="text-white"
          onConfirm={() => {
            setIsLoading(true);
            auth
              .signOut()
              .then(() => {
                setIsLoading(false);
                navigate("/");
              })
              .catch((error) => {
                setIsLoading(false);
                console.error("Error signing out:", error);
              });
          }}
          onCancel={() => setOpenModal(false)}
          Icon={ExclamationTriangleIcon} // Your Icon Component
          iconBgColor="bg-red-100"
          buttonBgColor="bg-red-600"
          iconTextColor="text-red-600"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
