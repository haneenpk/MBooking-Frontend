import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner'
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from "../../api/shared/instance";
import { useDispatch } from 'react-redux';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
    Button
} from "@material-tailwind/react";

const MovieTicketBooking = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const seatId = queryParams.get("seatId");
    const showId = queryParams.get("showId");
    const userId = localStorage.getItem('userData');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [diamondRows, setDiamondRows] = useState({});
    const [goldRows, setGoldRows] = useState({});
    const [silverRows, setSilverRows] = useState({});
    const [screenData, setScreenData] = useState({});
    const [totalAmount, setTotalAmount] = useState({ diamond: 0, gold: 0, silver: 0 }); // Total amount for each category

    useLayoutEffect(() => {
        const fetchTheaterScreenData = async () => {
            try {
                let responseScreen = await Axios.get(`/api/user/show/seat/${seatId}`);
                setDiamondRows(responseScreen.data.data.diamond.seats);
                setGoldRows(responseScreen.data.data.gold.seats);
                setSilverRows(responseScreen.data.data.silver.seats);
                setScreenData(responseScreen.data.data);
                setLoading(false);
            } catch (error) {
                setError(error);
            }
        };

        fetchTheaterScreenData();
    }, []);

    const handleSeatSelection = (row, colValue, category) => {
        const seatNumber = `${row}${colValue}`;

        setSelectedSeats(prevSeats => {
            // Check if the seat is already selected
            const seatIndex = prevSeats.findIndex(seat => seat.seatNumber === seatNumber && seat.category === category);

            if (seatIndex !== -1) {
                // If the seat is already selected, remove it
                return prevSeats.filter((_, index) => index !== seatIndex);
            } else {
                // If the seat is not already selected
                if (prevSeats.length < 10) {
                    // If less than 10 seats are selected, add the new seat
                    return [...prevSeats, {
                        seatNumber,
                        category
                    }];
                } else {
                    toast.info('Maximum 10 tickets');
                    return prevSeats;
                }
            }
        });

        // Update total amount based on category
        setTotalAmount(prevAmount => ({
            ...prevAmount,
            [category]: prevAmount[category] + (selectedSeats.some(seat => seat.seatNumber === seatNumber) ? -1 : 1) * screenData[category]?.price
        }));
    };

    const handleTicketBooking = async () => {
        try {
            console.log(selectedSeats);
            let response = await Axios.post(`/api/user/show/booking/hold`, { seatId, selectedSeats, showId, userId });
            if (response) {
                navigate(`/show/checkout?tempTicketId=${response.data.data._id}`)
            }
        } catch (error) {

        }
    }

    const renderSeats = (row, category) => {
        return row[1].map((seat, index) => {
            const seatId = `${row[0]}${seat.col}`;
            const isSeatSelected = selectedSeats.some(seat => seat.seatNumber === seatId);

            if (seat.col === 0) {
                return (
                    <div className='mx-auto' key={index}>
                        <span className="text-xs ml-1 inline-block w-5 h-6"></span>
                    </div>
                );
            }

            return (
                <div className='mx-auto my-1' key={index}>
                    {seat.isBooked === true || seat.isTempBooked === true ? (
                        <div
                            className="w-6 h-6 border rounded-sm flex items-center justify-center bg-gray-500"
                        >
                        </div>
                    ) : (
                        <div
                            className={`w-6 h-6 border rounded-sm flex items-center justify-center cursor-pointer border-black ${isSeatSelected ? 'bg-black text-white' : 'bg-white'}`}
                            onClick={() => handleSeatSelection(row[0], seat.col, category)}
                        >
                            <label htmlFor={seatId} className="text-xs text-center cursor-pointer">
                                {seat.col}
                            </label>
                        </div>
                    )}
                </div>
            );
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='mt-20'>

            <div className="fixed flex top-20 w-full text-center z-10 bg-white py-4 pl-10 shadow-md justify-center">
                <div className='flex'>
                    <div className="w-4 h-4 mt-1 border rounded-sm flex items-center justify-center border-black"></div>
                    <span className="mx-4">AVAILABLE</span>
                    <div className="w-4 h-4 mt-1 rounded-sm flex items-center justify-center bg-gray-500"></div>
                    <span className="mx-4">BOOKED</span>
                    <div className="w-4 h-4 mt-1 rounded-sm flex items-center justify-center bg-black"></div>
                    <span className="mx-4">SELECTED</span>
                </div>
            </div>

            <div className="mx-auto px-8 pb-8">
                {/* Diamond Seats */}
                <div className="mb-4 bg-white rounded-lg shadow-md p-3">
                    <h2 className="text-lg font-bold mb-2 text-center">{screenData.diamond && screenData.diamond.name} ₹{screenData.diamond && screenData.diamond.price}</h2>
                    {Object.entries(diamondRows).map(row => (
                        <div key={row[0]} className="flex items-center mb-3">
                            <span className="text-base mr-2 ml-1 font-bold w-4">{row[0]}</span>
                            {renderSeats(row, 'diamond')}
                        </div>
                    ))}
                </div>
                {/* Gold Seats */}
                <div className="mb-4 bg-white rounded-lg shadow-md p-3">
                    <h2 className="text-lg font-bold mb-2 text-center">{screenData.gold && screenData.gold.name} ₹{screenData.gold && screenData.gold.price}</h2>
                    {Object.entries(goldRows).map(row => (
                        <div key={row[0]} className="flex items-center mb-3">
                            <span className="text-base mr-2 ml-1 font-bold w-4">{row[0]}</span>
                            {renderSeats(row, 'gold')}
                        </div>
                    ))}
                </div>
                {/* Silver Seats */}
                <div className="mb-4 bg-white rounded-lg shadow-md p-3">
                    <h2 className="text-lg font-bold mb-2 text-center">{screenData.silver && screenData.silver.name} ₹{screenData.silver && screenData.silver.price}</h2>
                    {Object.entries(silverRows).map(row => (
                        <div key={row[0]} className="flex items-center mb-3">
                            <span className="text-base mr-2 ml-1 font-bold w-4">{row[0]}</span>
                            {renderSeats(row, 'silver')}
                        </div>
                    ))}
                </div>
                {/* Payment Section */}
                <div className={`${selectedSeats.length >= 1 ? 'mb-7' : ''} text-center pt-1`}>
                    <div className="p-4 mx-auto" style={{ maxWidth: '408px' }}>
                        <svg width="376" height="44" viewBox="0 0 376 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="376" height="44" />
                            <path d="M334.718 2.00062C228 10.0004 148 10.0004 39.6559 2.00062L16 30.9996C148 38.9999 228 38.9999 360 30.9996L334.718 2.00062Z" fill="white" />
                            <path d="M16 30.9996L39.6559 2.00062C148 10.0004 228 10.0004 334.718 2.00062L360 30.9996M16 30.9996L19.0003 35.9999C148 44 228 44 357 35.9999L360 30.9996M16 30.9996C148 38.9999 228 38.9999 360 30.9996" stroke="#101010" stroke-opacity="0.22" />
                            <path d="M332 5.49907C229 13.0005 145.5 13.0005 42.5 5.5009L23 28.5009C143 36.5005 232 36.501 351.923 28.4991L332 5.49907Z" fill="#E0F6FA" />
                            <path d="M138.715 26.6758C140.525 26.6758 141.645 25.8145 141.645 24.4434V24.4375C141.645 23.3652 140.977 22.7734 139.424 22.4688L138.645 22.3105C137.766 22.1348 137.402 21.8418 137.402 21.3672C137.402 20.7988 137.93 20.4531 138.709 20.4531C139.506 20.4473 140.021 20.8164 140.115 21.3379L140.127 21.3965H141.504L141.498 21.332C141.404 20.1895 140.396 19.334 138.709 19.334C137.098 19.334 135.943 20.1895 135.943 21.4551V21.4609C135.943 22.5156 136.594 23.1895 138.111 23.4824L138.891 23.6406C139.816 23.8223 140.18 24.1094 140.18 24.5898C140.18 25.1641 139.6 25.5625 138.756 25.5625C137.877 25.5625 137.256 25.1875 137.203 24.6309L137.197 24.584H135.785L135.791 24.6543C135.879 25.8789 136.98 26.6758 138.715 26.6758ZM146.727 26.6758C148.467 26.6758 149.715 25.709 149.885 24.2852V24.2383H148.461L148.449 24.2676C148.279 25.0293 147.623 25.5156 146.727 25.5156C145.537 25.5156 144.799 24.5547 144.799 23.0078V22.9961C144.799 21.4551 145.537 20.4941 146.721 20.4941C147.617 20.4941 148.285 21.0332 148.455 21.8418L148.461 21.8652H149.879L149.885 21.8125C149.727 20.3652 148.443 19.334 146.721 19.334C144.605 19.334 143.305 20.7344 143.305 23.002V23.0137C143.305 25.2754 144.611 26.6758 146.727 26.6758ZM151.844 26.5H153.303V23.9043H154.627L156.016 26.5H157.674L156.109 23.6992C156.959 23.3945 157.457 22.627 157.457 21.7188V21.707C157.457 20.3594 156.508 19.5098 154.861 19.5098H151.844V26.5ZM153.303 22.8965V20.5879H154.686C155.477 20.5879 155.963 21.0332 155.963 21.7363V21.748C155.963 22.4688 155.494 22.8965 154.709 22.8965H153.303ZM159.551 26.5H164.373V25.375H161.01V23.4883H164.186V22.4277H161.01V20.6348H164.373V19.5098H159.551V26.5ZM166.508 26.5H171.33V25.375H167.967V23.4883H171.143V22.4277H167.967V20.6348H171.33V19.5098H166.508V26.5ZM173.465 26.5H174.865V21.8535H174.93L178.41 26.5H179.641V19.5098H178.234V24.1504H178.17L174.695 19.5098H173.465V26.5ZM187.438 26.5H188.902V20.6348H191.123V19.5098H185.217V20.6348H187.438V26.5ZM193.012 26.5H194.471V23.5117H197.863V26.5H199.322V19.5098H197.863V22.3809H194.471V19.5098H193.012V26.5ZM201.645 26.5H203.104V19.5098H201.645V26.5ZM208.016 26.6758C209.826 26.6758 210.945 25.8145 210.945 24.4434V24.4375C210.945 23.3652 210.277 22.7734 208.725 22.4688L207.945 22.3105C207.066 22.1348 206.703 21.8418 206.703 21.3672C206.703 20.7988 207.23 20.4531 208.01 20.4531C208.807 20.4473 209.322 20.8164 209.416 21.3379L209.428 21.3965H210.805L210.799 21.332C210.705 20.1895 209.697 19.334 208.01 19.334C206.398 19.334 205.244 20.1895 205.244 21.4551V21.4609C205.244 22.5156 205.895 23.1895 207.412 23.4824L208.191 23.6406C209.117 23.8223 209.48 24.1094 209.48 24.5898C209.48 25.1641 208.9 25.5625 208.057 25.5625C207.178 25.5625 206.557 25.1875 206.504 24.6309L206.498 24.584H205.086L205.092 24.6543C205.18 25.8789 206.281 26.6758 208.016 26.6758ZM218.115 26.5H219.492L220.904 21.6426H220.986L222.404 26.5H223.775L225.727 19.5098H224.221L223.049 24.6367H222.967L221.572 19.5098H220.318L218.941 24.6367H218.865L217.682 19.5098H216.164L218.115 26.5ZM226.514 26.5H228.043L228.617 24.748H231.236L231.811 26.5H233.346L230.773 19.5098H229.08L226.514 26.5ZM229.883 20.8574H229.971L230.902 23.7168H228.951L229.883 20.8574ZM236.4 26.5H237.865V23.8105L240.426 19.5098H238.844L237.186 22.4805H237.092L235.428 19.5098H233.846L236.4 23.8105V26.5Z" fill="#101010" fill-opacity="0.54" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* Payment Summary */}
            {selectedSeats.length >= 1 && (
                <div className="fixed bottom-0 left-0 w-full text-center">
                    <div className="bg-white border-t-2 border-gray-500 pt-4 px-72 w-full z-10">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-bold">Selected Tickets:</span> {selectedSeats.length}
                            </div>
                            <div>
                                <span className="font-bold">Total Amount:</span> ₹{totalAmount.diamond + totalAmount.gold + totalAmount.silver}
                            </div>
                        </div>
                        <Button onClick={handleTicketBooking} className="mb-4 hover:bg-gray-800 ease-in-out duration-200">
                            Book Tickets
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieTicketBooking;
