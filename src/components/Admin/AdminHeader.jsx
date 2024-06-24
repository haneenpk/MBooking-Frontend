import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetAdminState } from '../../redux/slices/adminSlice';
import { VscAccount } from "react-icons/vsc";
import { IoLogOutOutline } from "react-icons/io5";
import { editSchema } from "../../validations/adminValidations/editSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import {
  Popover,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
  CardFooter,
  Input,
} from "@material-tailwind/react";

const AdminHeader = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [about, setAbout] = useState(false);
  const [adminDetails, setAdminDetails] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  const aboutRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleAbout = () => {
    setAbout(!about);
  };

  const handleClickOutside = (event) => {
    if (aboutRef.current && !aboutRef.current.contains(event.target)) {
      setAbout(false);
    }
  };

  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminAccessToken');
    dispatch(resetAdminState());
    navigate("/admin/login");
    toast.success('Logout successful');
  };

  const fetchAdminData = async () => {
    try {
      const adminId = localStorage.getItem('adminData');

      if (!adminId) {
        navigate('/admin/login');
        return;
      }

      const response = await Axios.get(`/api/admin/get/${adminId}`);
      const adminData = response.data.data;
      setAdminDetails(adminData);
      setFormData(adminData)

    } catch (error) {
      setError(error);
    }
  };

  // Handle form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Add logic to submit form data
    console.log(formData);
    try {
      // Validate formData against the signup schema
      await editSchema.validate(formData, { abortEarly: false });

      setErrors({}); // Clear previous validation errors

      // If validation passes, proceed with signup
      const response = await Axios.put(`/api/admin/update/${formData._id}`, formData);
      console.log(response.data.message);
      toast.success('Updated successful');
      handleClose()
      fetchAdminData()

    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  const handleOpen = () => {
    setOpen((cur) => !cur);
  }

  const handleClose = () => {
    setOpen((cur) => !cur);
    setFormData(adminDetails)

  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <header className="bg-gray-900 py-4 px-6 flex justify-between items-center sticky top-0 w-full z-10 shadow-md">
      <h1 className="text-white text-2xl font-bold">MBooking</h1>
      <div className="hidden md:flex gap-6 items-center">
        <NavLink to="/admin/" className="text-white hover:text-gray-300">Dashboard</NavLink>
        <NavLink to="/admin/users" className="text-white hover:text-gray-300">Users</NavLink>
        <NavLink to="/admin/theaters" className="text-white hover:text-gray-300">Theaters</NavLink>
        <NavLink to="/admin/upcoming" className="text-white hover:text-gray-300">Upcoming</NavLink>
        <NavLink to="/admin/movie" className="text-white hover:text-gray-300">Movie</NavLink>
      </div>
      <Popover placement="bottom-end">
        <div className="relative">
          <div onClick={toggleAbout}>
            <VscAccount color='white' size={32} />
          </div>
          {about && (
            <div className='fixed top-14 right-6 z-20' ref={aboutRef}>
              <div className="w-80 fixed top-18 bg-white p-3 rounded-lg shadow-lg right-6 z-20">
                <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
                  <VscAccount size={40} />
                  <div className="flex-grow">
                    <Typography variant="h6" color="blue-gray" className="break-words">
                      {adminDetails && adminDetails.name}
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium text-blue-gray-500"
                    >
                      Admin
                    </Typography>
                  </div>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="font-medium capitalize ml-auto mt-2"
                    onClick={handleOpen}
                  >
                    Edit
                  </Button>
                </div>
                <div>
                  <div className='flex ml-2'>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.00299 5.884L9.99999 9.882L17.997 5.884C17.9674 5.37444 17.7441 4.89549 17.3728 4.54523C17.0015 4.19497 16.5104 3.99991 16 4H3.99999C3.48958 3.99991 2.99844 4.19497 2.62717 4.54523C2.2559 4.89549 2.03259 5.37444 2.00299 5.884Z"
                        fill="#90A4AE"
                      />
                      <path
                        d="M18 8.11798L10 12.118L2 8.11798V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H16C16.5304 16 17.0391 15.7893 17.4142 15.4142C17.7893 15.0391 18 14.5304 18 14V8.11798Z"
                        fill="#90A4AE"
                      />
                    </svg>
                    <Typography variant="small" color="gray" className="font-medium text-blue-gray-500 ml-2">
                      {adminDetails && adminDetails.email}
                    </Typography>
                  </div>
                  <div className="flex justify-center items-center mt-4">
                    <Button onClick={handleLogout} variant="text" className='rounded-full'>
                      <IoLogOutOutline size={20} color='gray' />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          )}
        </div>
      </Popover>

      {showMenu && (
        <div className="md:hidden absolute bg-gray-800 top-full left-0 right-0 py-2 px-4">
          <ul className="flex flex-col gap-2">
            <NavLink to="/dashboard" className="text-white hover:text-gray-300">Dashboard</NavLink>
            <NavLink to="/theaters" className="text-white hover:text-gray-300">Theaters</NavLink>
            <NavLink to="/users" className="text-white hover:text-gray-300">Users</NavLink>
            <NavLink to="/banner" className="text-white hover:text-gray-300">Banner</NavLink>
          </ul>
        </div>
      )}
      <Dialog
        size="md"
        open={open}
        handler={handleClose}
        className="bg-transparent shadow-none max-h-screen overflow-y-auto"
      >
        <Card className="mx-auto w-full max-w-[25rem] ">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" className='text-center' color="blue-gray">
              Edit Profile
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            </div>
            {adminDetails && (
              <>
                <div>
                  <Typography className='mb-2' variant="h6">
                    Name
                  </Typography>
                  <Input
                    label="Name"
                    size="lg"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    autoFocus={false}
                  />
                  {errors.name &&
                    <FormErrorDisplay error={errors.name} />
                  }
                </div>
                <div>
                  <Typography className='' variant="h6">
                    Email
                  </Typography>
                  <Input label={formData.email} disabled />
                </div>
              </>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            {serverResponse && (
              <div className="mt-2 p-2 text-center font-bold text-red-600" role="alert">
                {serverResponse.message}
              </div>
            )}
            <Button
              variant="gradient"
              onClick={handleEditSubmit}
              fullWidth
            >
              Edit
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </header>
  );
};

export default AdminHeader;
