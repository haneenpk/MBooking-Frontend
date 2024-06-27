import React, { useEffect, useState } from "react";
import Axios from "../../api/shared/instance";
import io from 'socket.io-client'
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const socket = io(`${import.meta.env.VITE_AXIOS_BASE_URL}`)

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chatedTheaters, setChatedTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredTheaters, setFilteredTheaters] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [profile, setProfile] = useState("");
    const [isLoading, setLoading] = useState(true); // State to track loading status

    const userId = localStorage.getItem('userData');

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
        if (inputValue) {
            const filtered = theaters.filter((theater) =>
                theater.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredTheaters(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleMessage = (e) => {
        const inputValue = e.target.value;
        setMessage(inputValue);
    };

    const handleMessageSent = async () => {
        let obj = {
            userId: userId,
            theaterId: selectedTheater._id,
            sender: 'User',
            message
        }
        socket.emit("send-message", obj)
        setMessage("");
        fetchSelectedTheater(selectedTheater._id)
        const response3 = await Axios.get(`/api/user/chat/theaters/${userId}`);
        const sortedTheaters = response3.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setChatedTheaters(sortedTheaters);
    }

    const fetchSelectedTheater = async (id) => {
        const response = await Axios.get(`/api/user/chat/history?userId=${userId}&theaterId=${id}&role=Theater`);
        console.log("res : ", response);
        if (response.data.data !== null) {
            const response2 = await Axios.get(`/api/user/get/theater/${id}`);
            setSelectedTheater(response2.data.data)
            setChatHistory(response.data.data.messages)
        } else {
            const response2 = await Axios.get(`/api/user/get/theater/${id}`);
            setSelectedTheater(response2.data.data)
            console.log(response2.data.data);
            setChatedTheaters(prev => [{ theaterId: response2.data.data }, ...prev])
            setChatHistory([])
        }
    }

    const handleSelectTheater = (theater, id) => {
        setSearchInput(theater);
        fetchSelectedTheater(id)
        setShowDropdown(false);
    };

    // Function to format time
    const formatTime = (timeString) => {
        const options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Date(timeString).toLocaleTimeString([], options);
    };

    useEffect(() => {
        const fetchChatedTheaters = async () => {
            try {
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const response = await Axios.get(`/api/user/chat/theaters/${userId}`);
                const sortedTheaters = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                console.log();
                setChatedTheaters(sortedTheaters);

                const response2 = await Axios.get(`/api/user/all/theaters`);
                setTheaters(response2.data.data);

                const response3 = await Axios.get(`/api/user/get/${userId}`);
                setProfile(response3.data.data.profilePic);

                setLoading(false)
            } catch (error) {
                console.log(error);
                setError(error);
                setLoading(false)
            }
        };

        fetchChatedTheaters();
    }, []);

    useEffect(() => {
        socket.on('recieve-message', async (chatData) => {
            if (chatData.data.userId === userId && chatData.data.theaterId === selectedTheater._id) {
                fetchSelectedTheater(selectedTheater._id)
                // setChatHistory(chatData.data.messages);
            }
            const response3 = await Axios.get(`/api/user/chat/theaters/${userId}`);
            const sortedTheaters = response3.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChatedTheaters(sortedTheaters);
        });
    }, [socket, userId, selectedTheater._id])

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="mx-auto shadow-lg rounded-lg relative w-full">
            {/* header */}
            <div className="px-5 py-3 flex justify-between items-center bg-white border-b-2">
                <div className="font-semibold text-2xl">Chat With Theaters</div>
                <div className="w-1/2 relative">
                    <input
                        type="text"
                        placeholder="Search theaters"
                        className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
                        value={searchInput}
                        onChange={handleInputChange}
                    />
                    {showDropdown && (
                        <ul className="absolute top-full left-0 right-0 mt-2 bg-gray-100 rounded-lg shadow-md z-10">
                            {filteredTheaters.map((theater, index) => (
                                <li
                                    key={index}
                                    className="py-2 px-4 cursor-pointer hover:bg-gray-300 border-b-2"
                                    onClick={() => handleSelectTheater(theater.name, theater._id)}
                                >
                                    {theater.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {/* end header */}
            {/* Chatting */}
            <div className="flex flex-row justify-between bg-white relative">
                {/* chat list */}
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    <div className="overflow-y-auto" style={{ height: '581px' }}>
                        {/* search component */}
                        <div className=" py-2 px-2">
                            <input
                                type="text"
                                placeholder="Search chatted theaters"
                                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        {/* Check if there are chated theaters */}
                        {chatedTheaters.length > 0 ? (
                            // Repeat user list elements
                            chatedTheaters.map((theater, index) => (
                                <div
                                    onClick={() => fetchSelectedTheater(theater.theaterId._id)}
                                    key={index}
                                    className="flex flex-row py-2 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="w-1/4">
                                        <img
                                            src='/public/theaterProfile.webp'
                                            className="object-cover h-12 w-12 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-lg font-semibold">{theater.theaterId.name}</div>
                                    </div>
                                </div>


                            ))

                        ) : (
                            // Display message when there are no chated theaters
                            <div className="text-gray-500 text-center mt-4">No chatted theaters</div>
                        )}
                    </div>
                </div>
                {/* end chat list */}
                {/* message */}
                <div className="bg-gray-200 w-full flex flex-col justify-between">
                    {Object.keys(selectedTheater).length !== 0 ? (
                        <>
                            <div className="w-full h-15 bg-white flex">
                                <img
                                    src='/public/theaterProfile.webp'
                                    className="object-cover h-12 w-12 rounded-full m-2 ml-5"
                                    alt=""
                                />
                                <div className="text-lg font-semibold mt-4 ml-3">{selectedTheater.name}</div>
                            </div>
                            <div className="flex flex-col px-3 overflow-y-auto" style={{ height: '453px' }}>

                                {chatHistory.map((message, index) => (
                                    message.sender === "User" ? (
                                        <div key={index} className="flex justify-end my-2">
                                            {/* Message sent by others */}
                                            <span className="text-sm text-gray-500 mr-2 mt-3">{formatTime(message.time)}</span>
                                            <div className="flex items-center">
                                                <div className="py-2 px-3 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white flex">
                                                    {message.message}
                                                    {message.isRead ? (
                                                        <span className="mt-2 ml-2">
                                                            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path></svg>
                                                        </span>
                                                    ) : (
                                                        <span className="mt-2 ml-2">
                                                            <svg viewBox="0 0 12 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-check</title><path d="M11.1549 0.652832C11.0745 0.585124 10.9729 0.55127 10.8502 0.55127C10.7021 0.55127 10.5751 0.610514 10.4693 0.729004L4.28038 8.36523L1.87461 6.09277C1.8323 6.04622 1.78151 6.01025 1.72227 5.98486C1.66303 5.95947 1.60166 5.94678 1.53819 5.94678C1.407 5.94678 1.29275 5.99544 1.19541 6.09277L0.884379 6.40381C0.79128 6.49268 0.744731 6.60482 0.744731 6.74023C0.744731 6.87565 0.79128 6.98991 0.884379 7.08301L3.88047 10.0791C4.02859 10.2145 4.19574 10.2822 4.38194 10.2822C4.48773 10.2822 4.58929 10.259 4.68663 10.2124C4.78396 10.1659 4.86436 10.1003 4.92784 10.0156L11.5738 1.59863C11.6458 1.5013 11.6817 1.40186 11.6817 1.30029C11.6817 1.14372 11.6183 1.01888 11.4913 0.925781L11.1549 0.652832Z" fill="currentcolor"></path></svg>
                                                        </span>
                                                    )}
                                                </div>
                                                <img
                                                    src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${profile}`}
                                                    className="ml-2 object-cover h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index} className="justify-end my-2">
                                            <div className="flex items-center">
                                                <img
                                                    src='/public/theaterProfile.webp'
                                                    className="object-cover h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                                <div className="ml-2 py-2 px-3 bg-white rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-gray-700 inline-block">
                                                    {message.message}
                                                </div>
                                                <span className="text-sm text-gray-500 ml-2 mt-2">{formatTime(message.time)}</span>

                                            </div>

                                        </div>
                                    )
                                ))}

                            </div>
                            <div className="py-1 px-3 mb-2">
                                <div className="flex items-center">
                                    <input
                                        className="w-full bg-gray-50 py-3 px-3 rounded-l-xl"
                                        type="text"
                                        placeholder="Type your message here..."
                                        value={message}
                                        onChange={handleMessage}
                                    />
                                    <button onClick={handleMessageSent} className="py-3 px-4 bg-blue-400 rounded-r-xl text-white ml-2">
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full mt-10 flex items-center justify-center text-lg font-semibold">
                            Select theater for chat
                        </div>
                    )}
                </div>
                {/* end message */}
            </div>
        </div>
    );
};

export default Chat;
