import { useEffect, useState } from "react";
import { getUserCashDeposits } from "../../../config/cashBalance";
import { useParams } from "react-router-dom";
import { formatNumber } from "../../../config/utils";

export default function ClientCashPage() {
  const [cashTransaction, setCashTransaction] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    getCashBalance();
  });

  const getCashBalance = async () => {
    const result = await getUserCashDeposits(userId);
    setCashTransaction(result);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto text-left">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Cash Deposits
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the cash deposits and balances deposited into the
            clients account.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add deposit
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Amount
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Status
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Reference
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Date
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-left">
            {cashTransaction.map((item, index) => (
              <tr key={index}>
                <td className="w-2/5 max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0 capitalize w-">
                  {item.type}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only sm:hidden">Status</dt>
                    <dd className="mt-1 truncate text-gray-700 sm:hidden">
                      {item.status}
                    </dd>
                    <dt className="sr-only lg:hidden">Reference</dt>
                    <dd className="mt-1 truncate text-gray-500 lg:hidden">
                      {item.reference}
                    </dd>
                  </dl>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 ">
                  {formatNumber(item.amount)}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell capitalize">
                  {item.status}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500  capitalize">
                  {item.reference}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                  {item.date}
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {item.amount}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
