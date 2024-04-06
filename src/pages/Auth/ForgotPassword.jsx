import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, storage } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import DotLoader from "../../components/DotLoader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [whiteLogoUrl, setWhiteLogo] = useState('');
  const navigate = useNavigate();

  const fetchWhiteLogo = async () => {
    const storageRef = ref(storage, 'gs://cvs-online.appspot.com/logos/whiteLogo/');
    try {
      const logoUrl = await getDownloadURL(storageRef);
      setWhiteLogo(logoUrl);
    } catch (error) {
      console.error('Error fetching whiteLogo:', error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    // Fetch the whiteLogo when the component mounts
    fetchWhiteLogo();
  }, []);

  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Password reset email sent. Please check your inbox.");
        setTimeout(() => {
            setMessage("");
        }, 5000);
        setIsLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setError("Error sending password reset email. Please try again.");
        setTimeout(() => {
            setError("");
        }, 5000);
        setIsLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <div className="grid min-h-full h-screen flex-1 place-items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-blue-50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
              <img
                className="mx-auto h-10 w-auto"
                src={whiteLogoUrl}
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Please enter your email address to reset your password.
              </p>
            </div>
            <form className="space-y-4 text-left mt-10" action="#" method="POST" onSubmit={handleResetPassword}>
              <div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
