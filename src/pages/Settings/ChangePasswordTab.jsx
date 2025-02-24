import React, { Fragment, useEffect, useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import DotLoader from "../../components/DotLoader";
import { fetchPasswordPolicySetting } from "../../config/settings";
import { customModal } from "../../utils/modalUtils";
import { useModal } from "../../context/ModalContext";
import { Popover, Transition } from "@headlessui/react";

const strongPolicyRequirements = [
  { name: "Minimum of 6 characters" },
  { name: "One uppercase letter" },
  { name: "One lowercase letter" },
  { name: "At least one number" },
  { name: "At least one special character (!@#$%^&*)" },
];

const requirements = [
  { name: "No spaces allowed" },
  { name: "Minimum of 6 characters" },
];

export default function ChangePassword() {
  const { showModal } = useModal();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      customModal({
        showModal,
        title: "Error",
        text: "New password and confirm password do not match.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
      return false;
    }

    const regex = isStrongPasswordPolicy
      ? /^(?=.*\d)(?=.*[\W_]).{8,}$/ // Strong password policy
      : /^.{6,}$/;

    if (!regex.test(newPassword)) {
      customModal({
        showModal,
        title: "Error",
        text: isStrongPasswordPolicy
          ? "Password must be at least 8 characters long, must contain at least one number and a special character."
          : "Password must be at least 6 digits long.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
      return false;
    }
    return true;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      customModal({
        showModal,
        title: "Error",
        text: "Passwords do not match. Please make sure your current password is correct.",
        showConfirmButton: false,
        iconTextColor: "text-red-600",
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: ExclamationCircleIcon,
        timer: 1500,
      });
      return;
    }

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // User re-authenticated.
        return updatePassword(user, newPassword);
      })
      .then(() => {
        customModal({
          showModal,
          title: "Updated",
          text: "Password updated successfully.",
          showConfirmButton: false,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          icon: CheckIcon,
          timer: 1500,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.error(error);
        customModal({
          showModal,
          title: "Error",
          text: "Failed to update password. Please make sure your current password is correct.",
          showConfirmButton: false,
          iconTextColor: "text-red-600",
          iconBgColor: "bg-red-500",
          iconColor: "text-white",
          icon: ExclamationCircleIcon,
          timer: 1500,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Fetch the password policy setting from Firestore.
    fetchPasswordPolicySetting()
      .then((isStrong) => {
        setIsStrongPasswordPolicy(isStrong);
      })
      .catch((error) => {
        console.error("Error fetching password policy:", error);
      });
  }, []);

  return (
    <div className="">
      <form action="#" method="POST" onSubmit={handleChangePassword}>
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Change Password
              </h3>
              <div className="mt-1 text-sm text-gray-500 inline-flex gap-2">
                Update the password associated with your account.
                <Popover className="relative">
                <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  <span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5 text-teal-600"
                      aria-hidden="true"
                    />
                  </span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
                  <ul className="w-56 shrink rounded-xl bg-white p-3 text-sm font-medium leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5 text-left">
                      { isStrongPasswordPolicy ? (
                        strongPolicyRequirements.map((item) => (
                          <li
                            key={item.name}
                            className="block hover:text-teal-600"
                          >
                            {item.name}
                          </li>
                        ))) : (
                      requirements.map((item) => (
                        <li
                          key={item.name}
                          className="block hover:text-teal-600"
                        >
                          {item.name}
                        </li>
                      )))
                    }
                    </ul>
                  </Popover.Panel>
                </Transition>
              </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Current password
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                    type={showPassword ? "text" : "password"}
                    name="current_password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                    {showPassword ? (
                      <EyeIcon
                        className="h-5 w-5 text-teal-400"
                        aria-hidden="true"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  New password
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                    {showNewPassword ? (
                      <EyeIcon
                        className="h-5 w-5 text-teal-400"
                        aria-hidden="true"
                        onClick={toggleNewPasswordVisibility}
                      />
                    ) : (
                      <EyeSlashIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                        onClick={toggleNewPasswordVisibility}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {isLoading ? (
                <div className="flex w-full justify-center align-middle gap-2">
                  <span>Saving</span>
                  <DotLoader />
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
