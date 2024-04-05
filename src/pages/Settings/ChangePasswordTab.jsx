import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { CheckIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import DotLoader from "../../components/DotLoader";
import { useModal } from "../../context/ModalContext";
import { fetchPasswordPolicySetting } from "../../config/settings";
import { customModal } from "../../config/modalUtils";

export default function ChangePassword() {
  const { showModal } = useModal();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      setError("New password and confirm password do not match.");
      return false;
    }
    if (!validatePassword(newPassword, isStrongPasswordPolicy)) {
      setError(
        isStrongPasswordPolicy
          ? "Password must be at least 8 characters long, must contain at least one number and a special character."
          : "Password must be at least 6 digits long."
      );
      return false;
    }
    return true;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setTimeout(() => {
        setError("");
      }, 3000);
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
          title: "Data Updated",
          text: "Your data has been updated successfully",
          showConfirmButton: false,
          iconBgColor: "bg-green-100",
          iconTextColor: "text-green-600",
          buttonBgColor: "bg-green-600",
          icon: CheckIcon,
          timer: 1500,
        });  
      })
      .catch((error) => {
        setError(
          "Failed to update password. Please make sure your current password is correct."
        );
        console.error(error);
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
              <p className="mt-1 text-sm text-gray-500">
                Update the password associated with your account.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Current password
                </label>
                <div className="mt-2">
                  <input
                   type={showPassword ? "text" : "password"}
                   name="current_password"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                  {
              showPassword ? (
                <EyeIcon className="password_icon" onClick={togglePasswordVisibility} />
              ) : (
                <EyeSlashIcon className="password_icon" onClick={togglePasswordVisibility}/>
              )
            }
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  New password
                </label>
                <div className="mt-2">
                  <input
                    id="new-password"
                    name="new_password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
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
                    id="confirm-password"
                    name="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
