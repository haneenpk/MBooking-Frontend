import React, { useState } from 'react';
import Axios from "../../api/shared/instance";
import { addScreenSchema } from "../../validations/theaterValidations/addScreenSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate } from 'react-router-dom';

const AddScreen = () => {

    const navigate = useNavigate()

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
            // Validate formData against the signup schema
            await addScreenSchema.validate(newScreen, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            const theaterId = localStorage.getItem("theaterData")

            // If validation passes, proceed with signup
            const response = await Axios.post(`/api/theater/screens/add/${theaterId}`, newScreen);
            console.log(response.data.message);

            navigate("/theater/screens")
            

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className='px-14 mt-5'>
            <h3 className="text-xl font-semibold mb-2">Add Screen</h3>
                <div>
                    <label htmlFor="screenName" className="block text-sm font-medium text-gray-700">Screen Name</label>
                    <input type="text" name="name" id="screenName" value={newScreen.name} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
                    {errors.name &&
                            <FormErrorDisplay error={errors.name} />
                    }
                </div>
                <div>
                    <label htmlFor="rows" className="block text-sm font-medium text-gray-700">Rows</label>
                    <input type="number" name="rows" id="rows" value={newScreen.rows} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                    {errors.rows &&
                            <FormErrorDisplay error={errors.rows} />
                    }
                </div>
                <div>
                    <label htmlFor="cols" className="block text-sm font-medium text-gray-700">Columns</label>
                    <input type="number" name="cols" id="cols" value={newScreen.cols} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                    {errors.cols &&
                            <FormErrorDisplay error={errors.cols} />
                    }
                </div>
                <button onClick={handleAddScreen} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2">Add</button>
                {serverResponse && (
                    <div
                        className={`mt-2 p-2 text-center font-bold text-red-600`}
                        role="alert"
                    >
                        {serverResponse.message}
                    </div>
                )}
        </div>
    );
};

export default AddScreen;
