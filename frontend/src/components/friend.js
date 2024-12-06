import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/friend.css'; // Để áp dụng CSS từ file này
import Header from './header';


const FriendList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);


    // Hàm gửi yêu cầu kết bạn
    const handleInvite = async (userId) => {
        if (!invitedUsers.includes(userId)) {
            // Thêm người vào danh sách mời
            setInvitedUsers([...invitedUsers, userId]);
            await sendFriendRequest(userId); // Gửi yêu cầu kết bạn
        } else {
            // Nếu đã mời, hủy lời mời
            setInvitedUsers(invitedUsers.filter(id => id !== userId));
        }
    };

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Hàm tìm kiếm người dùng
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredUsers);
    };

    // Gửi yêu cầu kết bạn và thông báo cho người nhận
    const sendFriendRequest = async (userId) => {
        try {
            const response = await axios.post('http://localhost:5000/friend-request',
                { userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert(`Yêu cầu kết bạn đã được gửi đến ${response.data.name}`);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="friend-list-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm bạn bè..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Tìm kiếm</button>

                <h3>Danh sách bạn bè</h3>
                <ul className="friend-list">
                    {(searchResults.length > 0 ? searchResults : users).map((user) => (
                        <li key={user.id} className="friend-item">
                            <div className="friend-avatar">
                                <img src={user.image} alt={user.name} />
                            </div>
                            <div className="friend-details">
                                <span className="friend-name">{user.name}</span>
                                <span className="friend-email">({user.email})</span>
                            </div>
                            <button onClick={() => handleInvite(user.id)} className="friend-request-btn">Hủy bạn bè</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default FriendList;
