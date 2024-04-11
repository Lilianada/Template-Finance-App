import React, { useEffect, useState } from 'react'
import { getRegisteredUsers } from '../../config/user';
import { useNavigate } from 'react-router-dom';
import DotLoader from '../../components/DotLoader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingScreen from '../../components/LoadingScreen';
  
  export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const usersData = await getRegisteredUsers();
          setUsers(usersData);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      useEffect(() => {
        fetchUsers();
      }, []);

      const handleEdit = (userId) => {
        navigate(`/dashboard/registered_users/edit/${userId.uid}`, {
          state: { editUser: userId},
        });
      };
    
      const handleAddUser = () => {
        navigate(`/dashboard/add_new_user`);
      };

      const handleViewUser = (userId) => {
        navigate(`/dashboard/registered_users/view/${userId.uid}`, {
          state: { viewUser: userId},
        });
      }

    return (
      <div className="lg:px-4">
        <div className="sm:flex-auto text-left mt-4 mb-6">
        <button
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="h-5 w-5 stroke-gray-400 stroke-2" />
          <p className="text-sm text-gray-400 font-semibold">Back</p>
        </button>
      </div>
        <div className="sm:flex sm:items-center text-left">
          <div className="sm:flex-auto">
            <h1 className="text-lg font-semibold leading-6 text-gray-900">Registered Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their full name, email, mobile phone and user id.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleAddUser}
            >
              Create New User
            </button>
          </div>
        </div>
        { isLoading ? (
        <div className="mt-8">
          <LoadingScreen/>
        </div>
        ) :
          (<div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300 text-left">
            <thead>
              <tr>
                <th scope="col" 
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                 Full Name
                </th>
                <th
                  scope="col"
                  className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 "
                >
                  Mobile
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Email
                </th>
                <th scope="col" 
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  User Id
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((person, index) => (
                <tr key={index}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {person.fullName}
                    <dl className="font-normal lg:hidden">
                        <dt className="sr-only">User</dt>
                        <dd className="mt-1 truncate text-gray-700">{person.uid}</dd>
                        <dt className="sr-only sm:hidden">Email</dt>
                        <dd className="mt-1 truncate text-gray-500">{person.email}</dd>
                    </dl>
                  </td>
                  <td className=" px-3 py-4 text-sm text-gray-500 ">{person.mobilePhone}</td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell truncate">{person.email}</td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{person.uid}</td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button onClick={() => handleEdit(person)} className="text-indigo-600 hover:text-indigo-900">
                      Edit<span className="sr-only">, {person.fullName}</span>
                    </button>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button onClick={() => handleViewUser(person)} className="text-green-600 hover:text-green-900">
                      View<span className="sr-only">, {person.fullName}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>)}
      </div>
    )
  }
  