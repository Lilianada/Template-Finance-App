import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

const people = [
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsay Walton', mobile: '+2348100181416', email: 'lindsay.walton@example.com', role: 'Member' },
]

export default function Table() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <div className=" text-left flex align-bottom">
          {/* <h1 className="text-2xl font-semibold leading-6 text-gray-900">Registered Users</h1> */}
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-4">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    <div className="group inline-flex">
                      Full Name
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <div className="group inline-flex">
                      Email
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <div className="group inline-flex">
                      Mobile
                      <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <div className="group inline-flex">
                      Role
                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                        <ChevronDownIcon
                          className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.mobile}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <div className="text-green-600 hover:text-green-900 cursor-pointer">
                        View<span className="sr-only">, {person.name}</span>
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <div className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                        Edit<span className="sr-only">, {person.name}</span>
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                      <div className="text-red-600 hover:text-red-900 cursor-pointer">
                        Delete<span className="sr-only">, {person.name}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
