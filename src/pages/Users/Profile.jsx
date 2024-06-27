import React, { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from "../../redux/slices/userSlice";
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { editSchema } from "../../validations/userValidations/editSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import {
  MdEmail,
  MdDelete
} from "react-icons/md";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { RiImageEditFill } from "react-icons/ri";
import {
  IoWalletSharp,
  IoLogOutOutline
} from "react-icons/io5";
import {
  Tooltip,
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");

  const [isLoading, setLoading] = useState(true); // State to track loading status

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userAccessToken');
    dispatch(resetUserState());
    toast.success('Logout successful')
    navigate("/login")
  };

  useEffect(() => {
    if (error && error.response.data.message === "You are blocked") {
      localStorage.removeItem('userData');
      localStorage.removeItem('userAccessToken');
      dispatch(resetUserState());
      navigate("/login");
    }
  }, [error, navigate]);

  // Function to handle profile picture change
  const handleProfilePicChange = async (event) => {
    try {
      const userId = localStorage.getItem('userData');
      const formData = new FormData();
      formData.append('profilePicture', event.target.files[0]);
      const response = await Axios.patch(`/api/user/update/profileimage/${userId}`, formData);
      fetchUserData();
      dispatch(setUserData(response.data.data));
      toast.success('Update Image Successfully')
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  // Function to delete profile picture
  const deleteProfilePic = async () => {
    try {
      const userId = localStorage.getItem('userData');
      const response = await Axios.patch(`/api/user/remove/profileimage/${userId}`);
      fetchUserData();
      dispatch(setUserData(response.data.data));
      toast.success('Delete Image Successfully')
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userData');
      if (!userId) {
        navigate('/login');
        return;
      }
      const response = await Axios.get(`/api/user/get/${userId}`);
      const userData = response.data.data;
      setUserDetails(userData);
      setFormData(userData)
      setIsBlocked(userData.isBlocked);
      setLoading(false)
    } catch (error) {
      setError(error);
      setLoading(false)
    }
  };

  const handleOpen = () => {
    setOpen((cur) => !cur);
  }

  const handleClose = () => {
    setOpen((cur) => !cur);
    setFormData(userDetails)
  }

  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    try {
      // Validate formData against the edit schema
      await editSchema.validate(trimmedFormData, { abortEarly: false });

      setErrors({}); // Clear previous validation errors

      // If validation passes, proceed with update
      const response = await Axios.put(`/api/user/update/${formData._id}`, trimmedFormData);
      console.log(response.data.message);
      handleClose()
      toast.success("Update Successfully")
      fetchUserData();

    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  useLayoutEffect(() => {
    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Conditionally render profile component only if user is not blocked
  if (!isBlocked) {
    return (


      <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-4/12 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-10">
            <div className="px-6">
              <div className="flex flex-wrap justify-center relative">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={userDetails?.profilePic ? `${import.meta.env.VITE_AXIOS_BASE_URL}/${userDetails.profilePic}` : '/public/DefaultProfile.jpg'}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 max-w-[150px]"
                    />

                    <Tooltip content="Update Profile" placement="top-end">
                      <div className="absolute left-[-92px] top-3">
                        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" id="profilePicInput" />
                        <label htmlFor="profilePicInput" className="cursor-pointer">
                          <RiImageEditFill size={22} className="text-blue-700" />
                        </label>
                      </div>
                    </Tooltip>
                    <Tooltip content="Delete Profile" placement="top-start">
                      <button className="absolute right-[-116px] top-4 text-red-500" variant='text' size='sm'> <MdDelete size={22} onClick={deleteProfilePic} /></button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className='mt-24 flex justify-end'>
                <Button size='sm' onClick={handleOpen}>Edit Profile</Button>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold leading-normal text-blueGray-700 mb-2 ml-4">
                  {userDetails.username}
                </h3>
                <div className="mb-2 text-blueGray-600">
                  <MdEmail size={22} className="fas fa-map-marker-alt mr-2 mb-2 text-lg text-blueGray-400" />
                  {userDetails.email}
                </div>
                <div className="mb-2 text-blueGray-600">
                  <FaPhoneSquareAlt size={22} className="fas fa-briefcase mr-2 text-lg text-blueGray-400 mb-2" />
                  {userDetails.mobile}
                </div>
              </div>
              <div className="mt-5 py-10 border-t border-blueGray-200 relative">
                <div className="text-blueGray-600 font-semibold mb-3 ml-2 absolute">
                  <NavLink to="/wallet">
                    <Button size='sm' variant='text' className='h-12'>
                      <IoWalletSharp size={25} className="fas fa-briefcase mr-2 text-lg text-blueGray-400 mb-2" />
                      <span className='text-2xl'>{`₹${userDetails.wallet}`}</span>
                      
                    </Button>

                  </NavLink>                  
                </div>
                <div className='flex justify-end gap-x-2'>
                  <NavLink to="/booking-history">
                    <Button>Bookings</Button>
                  </NavLink>

                </div>
                <div className='flex justify-center mt-5'>
                  <Tooltip
                    content="Logout"
                    className="bg-blue-500"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      size='sm'
                      variant='text'
                      color='light-blue'
                      onClick={handleLogout}
                    >
                      <IoLogOutOutline size={25} />
                    </Button>
                  </Tooltip>

                </div>
              </div>
            </div>
          </div>
        </div>
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
              {userDetails && (
                <>
                  <div>
                    <Typography className='mb-2' variant="h6">
                      Name
                    </Typography>
                    <Input
                      label="Name"
                      size="lg"
                      name="username"
                      onChange={handleChange}
                      value={formData.username}
                      autoFocus={false}
                    />
                    {errors.username &&
                      <FormErrorDisplay error={errors.username} />
                    }
                  </div>
                  <div>
                    <Typography className='mb-2' variant="h6">
                      Mobile
                    </Typography>
                    <Input
                      label="Mobile"
                      size="lg"
                      name="mobile"
                      onChange={handleChange}
                      value={formData.mobile}
                      autoFocus={false}
                    />
                    {errors.mobile &&
                      <FormErrorDisplay error={errors.mobile} />
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
      </section>
    );
  } else {
    // Render null if user is blocked, to prevent rendering the profile component
    return null;
  }
};

export default UserProfile;
