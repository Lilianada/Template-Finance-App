import React from 'react';

export default function BankInfo() {
  return (
    <div className="py-6 bg-gray-50 px-4 my-8 rounded-md shadow">
        <div className="px-4 sm:px-0 text-left">
          <h3 className="text-lg font-semibold leading-7 text-gray-900">
            Banking Details
          </h3>
        </div>
        <div className="mt-6 text-left">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Account name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                Margot Foster
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Bank Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                Backend Bank of Africa
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Branch
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                Gotham City
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                BSB Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                1206000
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Account Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                1206000
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex space-x-3 justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit Details
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Delete Details
            </button>
          </div>
        </div>
      </div>
  )
}
