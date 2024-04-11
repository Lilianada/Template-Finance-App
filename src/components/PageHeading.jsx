import { Link } from 'react-router-dom'

export default function PageHeading({title, onclick}) {
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
    </div>
  )
}
