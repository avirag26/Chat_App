import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})
    const { socket, axios } = useContext(AuthContext);

    //function to get all users for sidebar


    const getUser = async () => {
        try {
            const { data } = await axios.get("/api/messages/users")
            if (data.success) {
                setUser(data.users);
                setUnseenMessages(data.unseenMessages);

            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    // function to get messages for selected user

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        }
    }

    //function to send message

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const subscribeToMessage = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsub

    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages, user, selectedUser, getUser, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }
    return (


        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}