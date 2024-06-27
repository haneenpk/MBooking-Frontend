import React, { useState, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'sonner'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetTheaterState } from '../../redux/slices/theaterSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { addScreenSchema } from "../../validations/theaterValidations/addScreenSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
} from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TheaterScreensList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState(null);
    const [listScreen, setListScreen] = useState([]);
    const [isBlocked, setIsBlocked] = useState(true);
    const [isLoader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedScreen, setSelectedScreen] = useState(null); // State to track the selected screen for action

    const [newScreen, setNewScreen] = useState({
        name: '',
        rows: '',
        cols: ''
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleOpen = (screen) => {
        setSelectedScreen(screen);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedScreen(null);
        setOpen(false);
    };

    const handleChange = (e) => {
        handleInputChange(e, newScreen, setNewScreen, setServerResponse, setErrors);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const trimmednewScreen = Object.fromEntries(
            Object.entries(newScreen).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
        );

        try {
            await addScreenSchema.validate(trimmednewScreen, { abortEarly: false });
            setErrors({});

            const theaterId = localStorage.getItem("theaterData");
            const response = await Axios.post(`/api/theater/screens/add/${theaterId}`, newScreen);
            console.log(response.data.message);
            handleCloseOpen()
            toast.success("Added Successfully")
            fetchData()
        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    const handleOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseOpen = () => {
        setOpenAdd((cur) => !cur);
        setNewScreen({
            name: '',
            rows: '',
            cols: ''
        })
        setErrors({})
        setServerResponse("")
    }

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let theaterId = queryParams.get("theaterId");
    let theaterName = queryParams.get("name");

    let role;

    if (location.pathname.startsWith("/admin/theater-screens")) {
        role = "admin"
    } else {
        role = "theater"
    }

    const fetchData = () => {
        const fetchTheaterData = async (theaterId) => {
            try {
                if (!theaterId) {
                    navigate("/theater/login");
                    return;
                }

                const response = await Axios.get(`/api/theater/get/${theaterId}`);
                setIsBlocked(response.data.data.isBlocked);

                const responseScreen = await Axios.get(`/api/theater/screens/${theaterId}`);
                setListScreen(responseScreen.data.data);
            } catch (error) {
                setError(error);
            }
        };

        const fetchTheaterDataAdmin = async (theaterId) => {
            try {
                const responseScreen = await Axios.get(`/api/admin/screens/${theaterId}`);
                setIsBlocked(false)
                setListScreen(responseScreen.data.data);
            } catch (error) {
                setError(error);
            }
        };

        if (location.pathname.startsWith("/admin/theater-screens")) {
            role = "admin"
            fetchTheaterDataAdmin(theaterId);
        } else {
            role = "theater"
            theaterId = localStorage.getItem('theaterData');
            fetchTheaterData(theaterId);
        }

        setLoader(false)
    }

    useLayoutEffect(() => {
        fetchData()
    }, [navigate]);

    const handleDelete = async (screenId) => {
        try {
            await Axios.delete(`/api/theater/screens/delete/${screenId}`);
            setListScreen(listScreen.filter(screen => screen._id !== screenId));
            handleClose(); // Close the modal after deletion
        } catch (error) {
            setError(error);
        }
    };

    if (error) {
        if (error.response && error.response.data.message === "You are blocked") {
            localStorage.removeItem('theaterData');
            localStorage.removeItem('theaterAccessToken');
            dispatch(resetTheaterState());
            console.log("Your account is blocked");
            navigate("/theater/login")
        }
    }

    if (isLoader) {
        return <LoadingSpinner />;
    } else if (!isBlocked) {
        return (
            <div className='px-8'>
                <h2 className="text-2xl font-bold mb-4 mt-5">{role === "admin" ? (<>{theaterName} Theater Screens List</>) : (<>Theater Screens List</>)}</h2>
                <Button onClick={handleOpenAdd}>Add Screen</Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                    {listScreen.map((screen) => (
                        <div key={screen._id} className="border p-4 rounded-md bg-white shadow-md">
                            <h3 className="text-lg font-semibold mb-2">{screen.name}</h3>
                            <p className="text-sm">Rows: {screen.rows}</p>
                            <p className="text-sm">Cols: {screen.cols}</p>
                            <p className="text-sm">Seats Count: {screen.seatsCount}</p>
                            <div className="flex justify-between mt-2">
                                <NavLink to={role === "theater" ? `/theater/screen/edit?seatId=${screen.seatId}&role=${role}` : `/admin/theater-screen/edit?seatId=${screen.seatId}&role=${role}&theaterId=${theaterId}`}>
                                    <Button size='sm' color='blue' variant='text'><FaEdit className='ml-1' size={22} /></Button>
                                </NavLink>
                                {role === "theater" && (
                                    <Button className='flex justify-end' size='sm' color='red' variant='text' onClick={() => handleOpen(screen)}><MdDelete size={22} /></Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {selectedScreen && (
                    <Dialog open={open} handler={handleClose} size='sm'>
                        <DialogHeader>Confirm Action</DialogHeader>
                        <DialogBody>
                            Are you sure you want to delete the "{selectedScreen.name}"?
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                variant="text"
                                color="red"
                                onClick={handleClose}
                                className="mr-1"
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button variant="gradient" color="green" onClick={() => handleDelete(selectedScreen._id)}>
                                <span>Confirm</span>
                            </Button>
                        </DialogFooter>
                    </Dialog>
                )}
                <Dialog
                    size="md"
                    open={openAdd}
                    handler={handleCloseOpen}
                    className="bg-transparent shadow-none max-h-screen overflow-y-auto"
                >
                    <Card className="mx-auto w-full max-w-[40rem] ">
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4" className='text-center' color="blue-gray">
                                Add Screen
                            </Typography>
                            <div>
                                <Typography className='mb-1' variant="h6">
                                    Screen Name
                                </Typography>
                                <Input
                                    label="Screen Name"
                                    size="lg"
                                    name="name"
                                    onChange={handleChange}
                                    value={newScreen.name}
                                    autoFocus={false}
                                />
                                {errors.name && <FormErrorDisplay error={errors.name} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography className='mb-1' variant="h6">
                                        Rows
                                    </Typography>
                                    <Input
                                        type='number'
                                        label="No of Rows"
                                        size="lg"
                                        name="rows"
                                        value={newScreen.rows}
                                        onChange={handleChange}
                                    />
                                    {errors.rows && <FormErrorDisplay error={errors.rows} />}
                                </div>
                                <div>
                                    <Typography className='mb-1' variant="h6">
                                        Cols
                                    </Typography>
                                    <Input
                                        type='number'
                                        label="No of Cols (max-30)"
                                        size="lg"
                                        name="cols"
                                        value={newScreen.cols}
                                        onChange={handleChange}
                                    />
                                    {errors.cols && <FormErrorDisplay error={errors.cols} />}
                                </div>
                            </div>

                        </CardBody>
                        <CardFooter className="pt-0">
                            {serverResponse && (
                                <div className="mt-2 p-2 text-center font-bold text-red-600" role="alert">
                                    {serverResponse.message}
                                </div>
                            )}
                            <Button
                                variant="gradient"
                                onClick={handleAddSubmit}
                                fullWidth
                            >
                                Add
                            </Button>

                        </CardFooter>
                    </Card>
                </Dialog>
            </div>
        );
    }
    return null;
};

export default TheaterScreensList;
