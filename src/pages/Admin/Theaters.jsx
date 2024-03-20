import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);

  const fetchTheaterData = async () => {
    try {
      const response = await Axios.get(`/api/admin/theaters`);
      console.log(response);
      setTheaters(response.data.data);
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  useLayoutEffect(() => {
    fetchTheaterData();
  }, []);

  const handleAction = async (userId) => {
    try {
      const response = await Axios.patch(`/api/admin/theaters/block/${userId}`);
      fetchTheaterData(); // Refetch user data after action
    } catch (error) {
      console.log(error);
      // Handle error
    }
  }

  const handleNavigation = () => {
    navigate('/admin/theaters');
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Theater List</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theater Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen Count</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {theaters.map(theater => (
                <tr key={theater._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{theater.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{theater.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{theater.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{theater.screenCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleAction(theater._id)} className={theater.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}>
                      {theater.isBlocked ? 'Unblock' : 'Block'}
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
