import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

const menus = [
  {
    title: 'Registered Users',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/dashboard/registered_users'
  },
  {
    title: 'Bonds',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/dashboard/bonds'
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16'/>,
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/lol'
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/lol'
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/lol'
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/lol'
  },
  {
    title: 'Regional Paradigm Technician',
    icon: <EnvelopeIcon className=' w-16' />,
    href: '/lol'
  },
]

export default function Dashboard() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
      {menus.map((item, index) => (
        <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow hover:scale-95 transition-all ease-in-out">
          <Link to={item.href} className="flex w-full h-[180px] items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center justify-center space-x-3">
                {item.icon}
              </div>
              <h2 className="mt-6 truncate text-xl text-gray-500">{item.title}</h2>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
