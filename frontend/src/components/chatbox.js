// ChatBox.js
import React, { useState } from "react";
import "../styles/chatbox.css"; // Thêm CSS cho chatbox

const ChatBox = ({ onClose, receiver }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { sender: "Me", text: message }]);
            setMessage("");
        }
    };

    return (
        <div className="chatbox">
            <div className="chatbox-header">
                <h3>Chat with {receiver}</h3>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
            <div className="chatbox-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "Me" ? "sent" : "received"}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="chatbox-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
