import React, { useEffect, useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
    IoWalletSharp
} from "react-icons/io5";

const Wallet = () => {
    const [userDetails, setUserDetails] = useState({});
    const [isLoading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userData');
                const response = await Axios.get(`/api/user/get/${userId}`);
                const userData = response.data.data;
                // Sort wallet history based on date in descending order
                userData.walletHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
                setUserDetails(userData);
                setLoading(false)
            } catch (error) {
                console.error(error);
                setLoading(false)
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="mx-auto mt-8 mb-8 px-10">
            <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md">
                {/* Wallet Amount */}
                <div className="bg-gray-900 py-4 px-6 text-white flex gap-x-3">
                    <IoWalletSharp size={35} />
                    <p className="text-3xl font-bold">{`₹${userDetails.wallet}`}</p>
                </div>

                {/* Wallet History Table */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Wallet History</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left pb-2">Amount</th>
                                <th className="text-left pb-2">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userDetails.walletHistory && userDetails.walletHistory.map((transaction, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                                    <td className={`py-2 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>{`₹${Math.abs(transaction.amount)}`}</td>
                                    <td className="py-2">{transaction.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Wallet;