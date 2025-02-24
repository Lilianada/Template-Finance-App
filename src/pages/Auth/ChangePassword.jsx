import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import DotLoader from "../../components/DotLoader";
import { customModal } from "../../utils/modalUtils";
import { CheckIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useModal } from "../../context/ModalContext";
import { useAlert } from "../../context/AlertContext";
import { customAlert } from "../../utils/alertUtils";
import { QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
// import { fetchPasswordPolicySetting } from "../../config/utils";
import logo from "../../assets/images/logo.png";
import { fetchPasswordPolicySetting } from "../../config/settings";
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
  const { showAlert, hideAlert } = useAlert();
  const { showModal } = useModal();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isStrongPasswordPolicy, setIsStrongPasswordPolicy] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (pass, isStrongPolicy) => {
    if (isStrongPolicy) {
      const regex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
      return regex.test(pass);
    } else {
      return pass.length >= 6;
    }
  };

  const validatePasswords = () => {
    if (newPassword !== confirmPassword) {
      customAlert({
        showAlert,
        title: "Error",
        description: "New password and confirm password do not match.",
        textColor: "text-red-800",
        icon: XCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        list: false,
        onClose: hideAlert,
        timer: 3000,
      });
      return false;
    }
    if (!validatePassword(newPassword, isStrongPasswordPolicy)) {
      isStrongPasswordPolicy
        ? customAlert({
            showAlert,
            title:
              "Error",
            description:"Password must be at least 8 characters long, must contain at least one number and a special character.",
            textColor: "text-red-800",
            icon: XCircleIcon,
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
            list: false,
            onClose: hideAlert,
            timer: 3000,
          })
        : customAlert({
            showAlert,
            title: "Error",
            description: "Password must be at least 6 digits long.",
            textColor: "text-red-800",
            icon: XCircleIcon,
            iconBgColor: "bg-red-100",
            iconTextColor: "text-red-600",
            list: false,
            onClose: hideAlert,
            timer: 3000,
          });
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validatePasswords()) {
      setIsLoading(false);
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      customModal({
        showModal,
        title: "Success",
        text: "Password updated successfully.",
        showConfirmButton: false,
        iconBgColor: "bg-green-100",
        iconTextColor: "text-green-600",
        buttonBgColor: "bg-green-600",
        icon: CheckIcon,
        timer: 1500,
      });

      navigate("/");
    } catch (err) {
      customModal({
        showModal,
        title: "Error",
        text: err.message || "Error updating password. Please try again.",
        showConfirmButton: false,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        buttonBgColor: "bg-red-600",
        icon: XCircleIcon,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="grid min-h-full h-screen flex-1 place-items-center justify-center py-12 sm:px-6 bg-blue-50 lg:px-8 sm:bg-custom-pattern bg-cover bg-center">
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-blue-50 px-6 py-12 sm:shadow sm:rounded-lg sm:px-12">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
            <img
              className="mx-auto h-10 w-auto"
              src={logo}
              alt="Company Logo"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Change Password
            </h2>
            <p className="mt-2 text-sm text-gray-700  grid place-items-center text-center">
              Please enter your current password and new password.
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
            </p>
          </div>

          <form
            className="space-y-4 text-left mt-10"
            action="#"
            method="POST"
            onSubmit={handleChangePassword}
          >
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                type={showPassword ? "text" : "password"}
                name="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="password"
                placeholder="Current Password"
              />
              <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? (
                  <EyeIcon
                    className="h-4 w-4 text-teal-300"
                    aria-hidden="true"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-4 w-4 text-gray-300"
                    aria-hidden="true"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>

            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={({ target: { value } }) => setNewPassword(value)}
                autoComplete="new-password"
                placeholder="New Password"
              />
              <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                {showNewPassword ? (
                  <EyeIcon
                    className="h-4 w-4 text-teal-300"
                    aria-hidden="true"
                    onClick={toggleNewPassword}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-4 w-4 text-gray-300"
                    aria-hidden="true"
                    onClick={toggleNewPassword}
                  />
                )}
              </div>
            </div>

            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                className="bg-white focus:bg-blue-50 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={({ target: { value } }) => setConfirmPassword(value)}
                autoComplete="confirm-password"
                placeholder="Confirm Password"
              />
              <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3">
                {showConfirmPassword ? (
                  <EyeIcon
                    className="h-4 w-4 text-teal-300"
                    aria-hidden="true"
                    onClick={toggleConfirmPassword}
                  />
                ) : (
                  <EyeSlashIcon
                    className="h-4 w-4 text-gray-300"
                    aria-hidden="true"
                    onClick={toggleConfirmPassword}
                  />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                {isLoading ? (
                  <div className="flex w-full justify-center align-middle gap-2">
                    <span>Submitting</span>
                    <DotLoader />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link
              to="/"
              className="font-semibold leading-6 text-teal-600 hover:text-teal-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
