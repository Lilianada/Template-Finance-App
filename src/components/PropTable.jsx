import React from "react";

function PropTable({ title, description, data, headings, onExportClick, editLink , noData}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-gray-50 py-8 my-4 lg:my-8 rounded-md shadow">
      <div className="sm:flex sm:items-center text-left">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onExportClick}
          >
            Export
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="overflow-x-auto ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-6">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {headings.map((heading, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {heading}
                    </th>
                  ))}
                  <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50">
                {data.map((item, idx) => (
                  <tr key={idx}>
                    {Object.values(item).map((value, index) => (
                      <td key={index} className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {value}
                      </td>
                    ))}
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href={editLink} className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {item.id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              {data.length === 0 && (
                   <div className="w-full grid place-items-center p-4">
                   <h5 className="text-gray-400 text-lg ">{noData}</h5>
                 </div>
               ) }
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropTable;
