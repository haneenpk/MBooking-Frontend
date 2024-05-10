import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const UserList = () => {

  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true); // State to track loading status

  const fetchUserData = async () => {
    try {
      const response = await Axios.get(`/api/admin/users`);
      setUsers(response.data.data.users);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      // Handle error
    }
  };

  useLayoutEffect(() => {
    fetchUserData();
  }, []);

  const handleAction = async (userId) => {
    try {
      const response = await Axios.patch(`/api/admin/users/block/${userId}`);
      fetchUserData(); // Refetch user data after action
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleAction(user._id)} className={user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
