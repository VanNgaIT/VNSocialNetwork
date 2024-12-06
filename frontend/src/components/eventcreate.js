import React, { useState } from 'react';
import axios from 'axios';
import '../styles/events.css'
import Header from './header';


const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // Trạng thái hiển thị popup
    const [eventInfo, setEventInfo] = useState(null); // Thông tin sự kiện

    // Giả sử danh sách bạn bè đã có sẵn
    const getFriends = async () => {
        try {
            // Gửi yêu cầu GET đến backend để lấy danh sách bạn bè (tạm thời giả lập dữ liệu)
            const response = await axios.get('http://localhost:5000/users');
            setFriends(response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách bạn bè:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Thực hiện gửi yêu cầu tạo sự kiện đến backend
        const eventData = {
            title,
            date,
            time,
            location,
            invitedFriends: selectedFriends,
        };

        try {
            const response = await axios.post('http://localhost:5000/create-event', eventData);
            setEventInfo(response.data); // Lưu thông tin sự kiện
            setShowPopup(true); // Hiển thị popup
            resetForm(); // Reset form
        } catch (error) {
            console.error('Lỗi khi tạo sự kiện:', error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDate('');
        setTime('');
        setLocation('');
        setSelectedFriends([]);
    };

    const handleFriendSelect = (friendId) => {
        setSelectedFriends((prev) => {
            if (prev.includes(friendId)) {
                return prev.filter((id) => id !== friendId);
            }
            return [...prev, friendId];
        });
    };

    React.useEffect(() => {
        getFriends(); // Lấy danh sách bạn bè khi component được render
    }, []);

    return (
        <>
            <Header />
            <div className="create-event-container">
                <h2>Tạo Sự Kiện Mới</h2>
                <form onSubmit={handleSubmit} className="create-event-form">
                    <input
                        type="text"
                        placeholder="Tiêu đề sự kiện"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Địa điểm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <div className="friends-selection">
                        <h3>Mời bạn bè tham gia</h3>
                        {friends.map((friend) => (
                            <div key={friend.id}>
                                <input
                                    type="checkbox"
                                    id={friend.id}
                                    checked={selectedFriends.includes(friend.id)}
                                    onChange={() => handleFriendSelect(friend.id)}
                                />
                                <label htmlFor={friend.id}>{friend.name}</label>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Tạo sự kiện</button>
                </form>
                {/* Popup hiển thị thông tin sự kiện */}
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <button className="close-btn" onClick={() => setShowPopup(false)}>
                                ✖
                            </button>
                            <h3>Thông tin sự kiện</h3>
                            <p><strong>Tiêu đề:</strong> {eventInfo?.title}</p>
                            <p><strong>Ngày:</strong> {eventInfo?.date}</p>
                            <p><strong>Giờ:</strong> {eventInfo?.time}</p>
                            <p><strong>Địa điểm:</strong> {eventInfo?.location}</p>
                            <p><strong>Danh sách mời:</strong> {eventInfo?.invitedFriends?.join(', ') || 'Không có bạn bè nào'}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CreateEvent;
