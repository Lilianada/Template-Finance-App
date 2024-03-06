/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { BarsArrowUpIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

export default function PageHeading({title, placeholder, onclick}) {
  return (
    <div className="mb-12 sm:flex sm:items-center sm:justify-between">
      <div className="mt-3 sm:mt-0">
        <Link
          to={onclick}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {title}
        </Link>
      </div>
      <div className="mt-3 sm:ml-4 sm:mt-0">
        <label htmlFor="mobile-search-candidate" className="sr-only">
          Search
        </label>
        <label htmlFor="desktop-search-candidate" className="sr-only">
          Search
        </label>
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="mobile-search-candidate"
              id="mobile-search-candidate"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:hidden"
              placeholder={placeholder}
                onClick={() => console.log('Search')}
            />
            <input
              type="text"
              name="desktop-search-candidate"
              id="desktop-search-candidate"
              className="hidden w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
              placeholder={placeholder}
              onClick={() => console.log('Search')}
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => console.log('Sort')}
          >
            <BarsArrowUpIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Sort
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
