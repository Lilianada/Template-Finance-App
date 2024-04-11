import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import Background from "../../assets/images/Background.jpg";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { auth, db, storage } from "../../config/firebase";
import { checkAdminRoleAndLogoutIfNot } from "../../config/utils";
import DotLoader from "../../components/DotLoader";
import { customAlert } from "../../utils/alertUtils";
import { useAlert } from "../../context/AlertContext";

export default function Login() {
  const { showAlert, hideAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const navigate = useNavigate();

  const fetchWhiteLogo = async () => {
    const storageRef = ref(
      storage,
      "gs://cvs-online.appspot.com/logos/darkLogo/"
    );
    try {
      const logoUrl = await getDownloadURL(storageRef);
      setLogoUrl(logoUrl);
    } catch (error) {
      console.error("Error fetching Logo:", error);
    }
  };

  useEffect(() => {
    fetchWhiteLogo();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      } else {
        return;
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    checkAdminRoleAndLogoutIfNot(db);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");

      const isAdmin = await checkAdminRoleAndLogoutIfNot(db);
      if (isAdmin) {
        navigate("/dashboard");
        setIsLoading(false);
      } else {
        customAlert({
          showAlert,
          title: "Access Denied",
          description: "You are not authorized as an admin.",
          textColor: "text-red-800",
          iconBgColor: "bg-red-100",
          iconTextColor: "text-red-600",
          icon: XCircleIcon,
          onClose: hideAlert,
          list: false,
          timer: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      customAlert({
        showAlert,
        title: "Access Denied",
        description: error.message ,
        textColor: "text-red-800",
        icon: XCircleIcon,
        iconBgColor: "bg-red-100",
        iconTextColor: "text-red-600",
        list: false,
        onClose: hideAlert,
        timer: 3000,
      });
    }
  };
  return (
    <div className="h-screen bg-blue-50">
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96 text-left">
            <div>
              <img className="h-12 w-auto" src={logoUrl} alt="Your Company" />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                To access the admin dashboard, please login with your info.
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form
                  action="#"
                  method="POST"
                  className="space-y-6"
                  onSubmit={handleLogin}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm leading-6 text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm leading-6">
                      <Link
                        to="/forgot-password"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center align-middle rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isLoading ? (
                        <div className="flex w-full justify-center align-middle gap-2">
                          <span>Loading</span>
                          <DotLoader />
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={Background}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
