import React, { useState } from 'react';
import Axios from "../../api/shared/instance";
import { addScreenSchema } from "../../validations/theaterValidations/addScreenSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate } from 'react-router-dom';

const AddScreen = () => {
    const navigate = useNavigate();

    const [newScreen, setNewScreen] = useState({
        name: '',
        rows: '',
        cols: ''
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleChange = (e) => {
        handleInputChange(e, newScreen, setNewScreen, setServerResponse, setErrors);
    };

    const handleAddScreen = async (e) => {
        e.preventDefault();

        try {
            await addScreenSchema.validate(newScreen, { abortEarly: false });
            setErrors({});

            const theaterId = localStorage.getItem("theaterData");
            const response = await Axios.post(`/api/theater/screens/add/${theaterId}`, newScreen);
            console.log(response.data.message);

            navigate("/theater/screens");
        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className='px-10 mt-5'>
            <h3 className="text-2xl font-semibold mb-5 text-center">Add Screen</h3>
            <div className="flex flex-col space-y-4 bg-white p-10 rounded-md border shadow-md">
                <div>
                    <label htmlFor="screenName" className="block text-sm font-medium text-gray-700">Screen Name</label>
                    <input type="text" name="name" id="screenName" value={newScreen.name} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500" placeholder='Enter Screen Name' />
                    {errors.name && <FormErrorDisplay error={errors.name} />}
                </div>
                <div>
                    <label htmlFor="rows" className="block text-sm font-medium text-gray-700">Rows</label>
                    <input type="number" name="rows" id="rows" value={newScreen.rows} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500" placeholder='Enter Screen Rows' />
                    {errors.rows && <FormErrorDisplay error={errors.rows} />}
                </div>
                <div>
                    <label htmlFor="cols" className="block text-sm font-medium text-gray-700">Columns</label>
                    <input type="number" name="cols" id="cols" value={newScreen.cols} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500" placeholder='Enter Screen coloumn (max-30)' />
                    {errors.cols && <FormErrorDisplay error={errors.cols} />}
                </div>
                <div className='justify-center flex pt-3'>
                    <button onClick={handleAddScreen} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none w-40">Add</button>
                </div>
                {serverResponse && (
                    <div className="mt-2 p-2 text-center font-bold text-red-600">
                        {serverResponse.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddScreen;