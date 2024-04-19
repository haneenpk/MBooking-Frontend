import React, { useEffect, useState } from "react";
import Axios from "../../api/shared/instance";
import io from 'socket.io-client'

const socket = io("http://localhost:3000")

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

    const handleMessageSent = () => {
        let obj = {
            userId: userId,
            theaterId: selectedTheater._id,
            sender: 'User',
            message
        }
        socket.emit("send-message", obj)
        fetchSelectedTheater(selectedTheater._id)
    }

    const fetchSelectedTheater = async (id) => {
        const response = await Axios.get(`/api/user/chat/history?userId=${userId}&theaterId=${id}`);
        if (response.data.data !== null) {
            const response2 = await Axios.get(`/api/user/get/theater/${id}`);
            setSelectedTheater(response2.data.data)
            setChatHistory(response.data.data.messages)
        } else {
            const response2 = await Axios.get(`/api/user/get/theater/${id}`);
            setSelectedTheater(response2.data.data)
            setChatedTheaters(prev => [...prev, response2.data.data])
            setChatHistory([])
        }
    }

    const handleSelectTheater = (theater, id) => {
        setSearchInput(theater);
        fetchSelectedTheater(id)
        setShowDropdown(false);
    };

    useEffect(() => {
        const fetchChatedTheaters = async () => {
            try {
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const response = await Axios.get(`/api/user/chat/theaters/${userId}`);
                setChatedTheaters(response.data.data)

                const response2 = await Axios.get(`/api/user/all/theaters`)
                setTheaters(response2.data.data);

                const response3 = await Axios.get(`/api/user/get/${userId}`);
                setProfile(response3.data.data.profilePic)

            } catch (error) {
                console.log(error);
                setError(error);
            }
        };

        fetchChatedTheaters();
    }, [])

    useEffect(() => {
        socket.on('recieve-message', async (chatData) => {
            if (chatData.data.userId === userId && chatData.data.theaterId === selectedTheater._id) {
                setChatHistory(chatData.data.messages);
            }
        });
    }, [socket, userId, selectedTheater._id])

    return (
        <div className="container mx-auto shadow-lg rounded-lg relative">
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
                    <div className="overflow-y-auto" style={{ height: '488px' }}>
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
                                    onClick={() => fetchSelectedTheater(theater._id)}
                                    key={index}
                                    className="flex flex-row py-2 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="w-1/4">
                                        <img
                                            src="https://via.placeholder.com/150"
                                            className="object-cover h-12 w-12 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-lg font-semibold">{theater.name}</div>
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
                                    src="https://via.placeholder.com/150"
                                    className="object-cover h-12 w-12 rounded-full m-2 ml-5"
                                    alt=""
                                />
                                <div className="text-lg font-semibold mt-4 ml-3">{selectedTheater.name}</div>
                            </div>
                            <div className="flex flex-col px-3 overflow-y-auto" style={{ height: '370px' }}>

                                {chatHistory.map((message, index) => (
                                    message.sender === "User" ? (
                                        <div key={index} className="flex justify-end my-2">
                                            {/* Message sent by others */}
                                            <div className="flex items-center">
                                                <div className="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                                    {message.message}
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
                                                    src="https://via.placeholder.com/150"
                                                    className="object-cover h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                                <div className="ml-2 py-3 px-4 bg-white rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-gray-700 inline-block">
                                                    {message.message}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}

                            </div>
                            <div className="py-1 px-3">
                                <div className="flex items-center">
                                    <input
                                        className="w-full bg-gray-50 py-3 px-3 rounded-l-xl"
                                        type="text"
                                        placeholder="Type your message here..."
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
