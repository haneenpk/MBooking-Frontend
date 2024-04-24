import React, { useEffect, useState, useRef } from "react";
import Axios from "../../api/shared/instance";
import io from 'socket.io-client'

const socket = io("http://localhost:3000")

const Chat = () => {
    const [message, setMessage] = useState("")
    const [chatedUsers, setChatedUsers] = useState([
        {
            name: "Leena"
        },
        {
            name: "Sangeetha"
        }
    ]);
    const [selectedUser, setSelectedUser] = useState({});
    const [chatHistory, setChatHistory] = useState([]);
    const theaterId = localStorage.getItem('theaterData');
    const chatContainerRef = useRef(null); // Ref for chat container

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

        // Emit the 'send-message' event with the message object
        socket.emit("send-message", obj);

        setMessage(""); // Clearing the message input after sending

        await fetchSelectedTheater(selectedUser);
    };

    const scrollDown = () => {
        // Scroll to the bottom of the chat container after updating chat history
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    const fetchSelectedTheater = async (user) => {
        const response = await Axios.get(`/api/theater/chat/history?theaterId=${theaterId}&userId=${user._id}&role=Theater`);
        if (response.data.data !== null) {
            setSelectedUser(user)
            setChatHistory(response.data.data.messages);
            scrollDown();
        }
    }

    useEffect(() => {
        const fetchChatedTheaters = async () => {
            try {
                if (!theaterId) {
                    navigate('/login');
                    return;
                }

                const response = await Axios.get(`/api/theater/chat/users/${theaterId}`);
                setChatedUsers(response.data.data)

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
                setChatHistory(chatData.data.messages);
            }
        });
    }, [socket, theaterId, selectedUser._id])

    return (
        <div className="container mx-auto shadow-lg  relative border mt-4">
            {/* Chatting */}
            <div className="flex flex-row justify-between bg-white relative">
                {/* chat list */}
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    <div className="overflow-y-auto" style={{ height: '547px' }}>
                        {/* search component */}
                        <div className=" py-2 px-2">
                            <input
                                type="text"
                                placeholder="Search chatted theaters"
                                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                            />
                        </div>
                        {/* Check if there are chatted users */}
                        {chatedUsers.length > 0 ? (
                            // Repeat user list elements
                            chatedUsers.map((theater, index) => (
                                <div
                                    onClick={() => fetchSelectedTheater(theater)}
                                    key={index}
                                    className="flex flex-row py-2 px-2 justify-center items-center border-b-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="w-1/4">
                                        <img
                                            src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${theater.profilePic}`}
                                            className="object-cover h-12 w-12 rounded-full"
                                            alt=""
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-lg font-semibold">{theater.username}</div>
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
                            <div ref={chatContainerRef} className="flex flex-col px-3 overflow-y-auto" style={{ height: '427px' }}>
                                {chatHistory.map((message, index) => (
                                    message.sender === "Theater" ? (
                                        <div key={index} className="flex justify-end my-2">
                                            {/* Message sent by others */}
                                            <div className="flex items-center">
                                                <div className="py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                                    {message.message}
                                                </div>
                                                {message.isRead !== true ? (
                                                    <span>x</span>
                                                ) : (
                                                    <span>xx</span>
                                                )}
                                                <img
                                                    src="https://via.placeholder.com/150"
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
