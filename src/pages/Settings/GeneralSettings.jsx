import React, { useEffect, useState } from "react";
import {
  fetchBondsFeature,
  fetchChatFeature,
  fetchIposFeature,
  fetchIposTablesFeature,
  fetchPasswordPolicySetting,
  fetchTermsFeature,
  fetchToolsFeature,
  updateBondsFeature,
  updateChatFeature,
  updateIposFeature,
  updateIposTablesFeature,
  updatePasswordPolicySetting,
  updateTermsFeature,
  updateToolsFeature,
} from "../../config/settings";

export default function GeneralSettings() {
  const [strongPasswordPolicy, setStrongPasswordPolicy] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isToolsEnabled, setIsToolsEnabled] = useState(false);
  const [isBondsEnabled, setIsBondsEnabled] = useState(false);
  const [isIposEnabled, setIsIposEnabled] = useState(false);
  const [isTermsEnabled, setIsTermsEnabled] = useState(false);
  const [displayIposTables, setDisplayIposTables] = useState(false);

  const fetchPasswordSetting = async () => {
    try {
      const passwordPolicy = await fetchPasswordPolicySetting();
      setStrongPasswordPolicy(passwordPolicy);
    } catch (error) {
      console.error("Error fetching password policy:", error);
    }
  };

  const fetchChatSetting = async () => {
    try {
      const chatEnabled = await fetchChatFeature();
      setIsChatEnabled(chatEnabled);
    } catch (error) {
      console.error("Error fetching chat setting:", error);
    }
  };

  const fetchToolsSetting = async () => {
    try {
      const toolsEnabled = await fetchToolsFeature();
      setIsToolsEnabled(toolsEnabled);
    } catch (error) {
      console.error("Error fetching tools setting:", error);
    }
  };

  const fetchTermsSetting = async () => {
    try {
      const termsEnabled = await fetchTermsFeature();
      setIsTermsEnabled(termsEnabled);
    } catch (error) {
      console.error("Error fetching terms setting:", error);
    }
  };

  const fetchBondsSetting = async () => {
    try {
      const bondsEnabled = await fetchBondsFeature();
      setIsBondsEnabled(bondsEnabled);
    } catch (error) {
      console.error("Error fetching Bonds setting:", error);
    }
  };

  const fetchIposSetting = async () => {
    try {
      const iposEnabled = await fetchIposFeature();
      setIsIposEnabled(iposEnabled);
    } catch (error) {
      console.error("Error fetching Ipos setting:", error);
    }
  };

  const fetchIposTablesSetting = async () => {
    try {
      const tablesEnabled = await fetchIposTablesFeature();
      setDisplayIposTables(tablesEnabled);
    } catch (error) {
      console.error("Error fetching Tables setting:", error);
    }
  };

  useEffect(() => {
    fetchPasswordSetting();
    fetchChatSetting();
    fetchToolsSetting();
    fetchTermsSetting();
    fetchBondsSetting();
    fetchIposSetting();
    fetchIposTablesSetting();
  }, []);

  const togglePasswordPolicy = () => {
    const updatedValue = !strongPasswordPolicy;
    setStrongPasswordPolicy(updatedValue);

    updatePasswordPolicySetting(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating password policy: ", error);
      });
  };

  const toggleToolsFeature = () => {
    const updatedValue = !isToolsEnabled;
    setIsToolsEnabled(updatedValue);

    updateToolsFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  const toggleTermsFeature = () => {
    const updatedValue = !isTermsEnabled;
    setIsTermsEnabled(updatedValue);

    updateTermsFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  const toggleBondsFeature = () => {
    const updatedValue = !isBondsEnabled;
    setIsBondsEnabled(updatedValue);

    updateBondsFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  const toggleIposFeature = () => {
    const updatedValue = !isIposEnabled;
    setIsIposEnabled(updatedValue);

    updateIposFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  const toggleTablesFeature = () => {
    const updatedValue = !displayIposTables;
    setDisplayIposTables(updatedValue);

    updateIposTablesFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  return (
    <div>
      <form action="#" method="POST">
        <div className="shadow sm:overflow-hidden sm:rounded-md">
          <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                General Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                General Settings for the Client App. Check the box to enable the
                settings.
              </p>
            </div>
            {/* password policy */}
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Password
              </legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="password-policy"
                      name="password-policy"
                      type="checkbox"
                      checked={strongPasswordPolicy}
                      onChange={togglePasswordPolicy}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="password-policy"
                      className="font-medium text-gray-900"
                    >
                      Password Policy
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable strict password policy.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Menu Visibility
              </legend>
              <div className="mt-4 space-y-4">
                {/* tools menu */}
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="tools-menu"
                      name="tools-menu"
                      type="checkbox"
                      checked={isToolsEnabled}
                      onChange={toggleToolsFeature}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="tools-menu"
                      className="font-medium text-gray-900"
                    >
                      Tools Menu
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable the display of Tools menu.
                    </p>
                  </div>
                </div>
                {/* ipos menu */}
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="ipos-menu"
                      name="ipos-menu"
                      type="checkbox"
                      checked={isIposEnabled}
                      onChange={toggleIposFeature}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="ipos-menu"
                      className="font-medium text-gray-900"
                    >
                      IPOs Menu
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable the display of IPOs menu.
                    </p>
                  </div>
                </div>
                {/* bonds menu */}
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="bonds-menu"
                      name="bonds-menu"
                      type="checkbox"
                      checked={isBondsEnabled}
                      onChange={toggleBondsFeature}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="bonds-menu"
                      className="font-medium text-gray-900"
                    >
                      Bonds Menu
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable the display of Bonds menu.
                    </p>
                  </div>
                </div>
                {/* terms menu */}
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="terms-menu"
                      name="terms-menu"
                      type="checkbox"
                      checked={isTermsEnabled}
                      onChange={toggleTermsFeature}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="terms-menu"
                      className="font-medium text-gray-900"
                    >
                      Terms Menu
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable the display of Terms menu.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Table Visibility
              </legend>
              <div className="mt-4 space-y-4">
                {/* ipos table */}
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="ipos-table"
                      name="ipos-table"
                      checked={displayIposTables}
                      onChange={toggleTablesFeature}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="ipos-table"
                      className="font-medium text-gray-900"
                    >
                      IPOs table visibility
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable IPOs table and balance visibilty.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
