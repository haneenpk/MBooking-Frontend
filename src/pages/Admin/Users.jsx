import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await Axios.get(`/api/admin/users`);
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchUserData();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  const handleAction = async () => {
    try {
      const response = await Axios.patch(`/api/admin/users/block/${selectedUser._id}`);
      fetchUserData();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

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
                  <td className="py-4 whitespace-nowrap">
                    <Button
                      variant="text"
                      onClick={() => handleOpen(user)}
                      color={user.isBlocked ? 'green' : 'red'}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <Dialog open={open} handler={() => handleOpen(null)} size='sm'>
          <DialogHeader>Confirm Action</DialogHeader>
          <DialogBody>
            Are you sure you want to {selectedUser.isBlocked ? 'unblock' : 'block'} the user "{selectedUser.username}"?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => handleOpen(null)}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={handleAction}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default UserList;
