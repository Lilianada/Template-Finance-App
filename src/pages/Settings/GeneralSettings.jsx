import React from "react";

export default function GeneralSettings() {
  return (
    <div >
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

            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Password
              </legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
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
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-900"
                    >
                      Tools Menu
                    </label>
                    <p className="text-gray-500">
                      Check the box to enable the display of Tools menu.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="candidates"
                        className="font-medium text-gray-900"
                      >
                        IPOs Menu
                      </label>
                      <p className="text-gray-500">
                        Check the box to enable the display of IPOs menu.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-gray-900"
                      >
                        Bonds Menu
                      </label>
                      <p className="text-gray-500">
                        Check the box to enable the display of Bonds menu.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="offers"
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
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Table Visibility
              </legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="comments"
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
