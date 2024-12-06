import React from 'react';
import "../styles/messagesList.css"; // Nếu có cần thiết lập style riêng cho MessagesList

const MessagesList = ({ messages = [], onMessageClick }) => {
    messages = [
        { sender: "Độ Mixi", message: "Bắn PUBG", timestamp: "2024-12-04T22:04:22.138Z", avatar: "https://th.bing.com/th/id/OIP.-r_tavAl_66lJhVU_vVv7wHaEK?w=257&h=180&c=7&r=0&o=5&pid=1.7" },
        { sender: "Faker", message: "Chơi liên minh huyền thoại", timestamp: "2024-12-05T01:22:56.406Z", avatar: "https://th.bing.com/th/id/OIP.itTOHKQLRA9KtBlFoA5VNgHaFj?w=231&h=180&c=7&r=0&o=5&pid=1.7" },
        { sender: "Kevin De Bruyne", message: "Đá Primier League", timestamp: "2024-12-05T01:22:56.406Z", avatar: "https://th.bing.com/th/id/OIP.l4LwIeK4M0G2xknvS_aw8AHaEK?w=292&h=180&c=7&r=0&o=5&pid=1.7" },
        // Thêm các tin nhắn khác
    ];

    return (
        <div className="messages-list">
            <h2>Tin nhắn</h2>
            {messages.map((message, index) => (
                <div key={index} className="message-item" onClick={() => onMessageClick(message)}>
                    <img src={message.avatar} alt="Avatar" className="message-avatar" />
                    <div className="message-content">
                        <div className="message-sender">{message.sender}</div>
                        <div className="message-text">{message.message}</div>
                        <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessagesList;
