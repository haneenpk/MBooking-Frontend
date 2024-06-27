import React, { useEffect, useState, useRef } from "react";
import Axios from "../../api/shared/instance";
import io from 'socket.io-client'
import LoadingSpinner from '../../components/Common/LoadingSpinner'; // Import LoadingSpinner component

const socket = io(`${import.meta.env.VITE_AXIOS_BASE_URL}`)

const Chat = () => {
    const [message, setMessage] = useState("");
    const [chatedUsers, setChatedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const theaterId = localStorage.getItem('theaterData');
    const chatContainerRef = useRef(null);

    const handleMessage = (e) => {
        const inputValue = e.target.value;
        setMessage(inputValue);
    };

    const handleMessageSent = async () => {
        let obj = {
            userId: selectedUser._id,
            theaterId: theaterId,
            sender: 'Theater',
            message
        };

        socket.emit("send-message", obj);

        setMessage("");

        await fetchSelectedTheater(selectedUser);
        const response3 = await Axios.get(`/api/theater/chat/users/${theaterId}`);
        const sortedUsers = response3.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setChatedUsers(sortedUsers)
    };

    const scrollDown = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const fetchSelectedTheater = async (user) => {
        const response = await Axios.get(`/api/theater/chat/history?theaterId=${theaterId}&userId=${user._id}&role=User`);
        if (response.data.data !== null) {
            setSelectedUser(user)
            setChatHistory(response.data.data.messages);
            scrollDown();
        }
    }

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
                if (!theaterId) {
                    navigate('/login');
                    return;
                }

                const response = await Axios.get(`/api/theater/chat/users/${theaterId}`);
                const sortedUsers = response.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setChatedUsers(sortedUsers)

            } catch (error) {
                console.log(error);
                setError(error);
            }
        };

        fetchChatedTheaters();
    }, [])

    useEffect(() => {
        socket.on('recieve-message', async (chatData) => {
            if (chatData.data.userId === selectedUser._id && chatData.data.theaterId === theaterId) {
                await fetchSelectedTheater(selectedUser);
            }
            const response3 = await Axios.get(`/api/theater/chat/users/${theaterId}`);
            const sortedUsers = response3.data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChatedUsers(sortedUsers)
        });
    }, [socket, theaterId, selectedUser._id])

    return (
        <div className=" mx-auto shadow-lg  relative border w-full">
            {/* Chatting */}
            <div className="flex flex-row justify-between bg-white relative">
                {/* chat list */}
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    <div className="overflow-y-auto" style={{ height: '669px' }}>
                        {/* search component */}
                        <div className=" py-2 px-2">
                            <input
                                type="text"
                                placeholder="Search chatted Users"
                                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        {/* Check if there are chatted users */}
                        {chatedUsers.length > 0 ? (
                            // Repeat user list elements
                            chatedUsers.map((theater, index) => (
                                <div
                                    onClick={() => fetchSelectedTheater(theater.userId)}
                                    key={index}
                                    className="flex flex-row py-2 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="w-1/4">
                                        <img
                                            src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${theater.userId.profilePic}`}
                                            className="object-cover h-12 w-12 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-lg font-semibold">{theater.userId.username}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Display message when there are no chatted users
                            <div className="text-gray-500 text-center mt-4">No chatted users</div>
                        )}
                    </div>
                </div>
                {/* end chat list */}
                {/* message */}
                <div className="bg-gray-200 w-full flex flex-col justify-between">
                    {Object.keys(selectedUser).length !== 0 ? (
                        <>
                            <div className="w-full h-15 bg-white flex">
                                <img
                                    src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${selectedUser.profilePic}`}
                                    className="object-cover h-12 w-12 rounded-full m-2 ml-5"
                                    alt=""
                                />
                                <div className="text-lg font-semibold mt-4 ml-3">{selectedUser.username}</div>
                            </div>
                            <div ref={chatContainerRef} className="flex flex-col px-3 overflow-y-auto" style={{ height: '541px' }}>
                                {chatHistory.map((message, index) => (
                                    message.sender === "Theater" ? (
                                        <div key={index} className="flex justify-end my-2">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500 mr-2 mt-2">{formatTime(message.time)}</span>
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
                                                    src='/public/theaterProfile.webp'
                                                    className="ml-2 object-cover h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index} className="justify-end my-2 ">
                                            <div className="flex items-center">
                                                <img
                                                    src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${selectedUser.profilePic}`}
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
                            Select users for chat
                        </div>
                    )}
                </div>
                {/* end message */}
            </div>
        </div>
    );
};

export default Chat;
