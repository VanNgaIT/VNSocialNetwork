import React, { useState } from 'react';
import '../styles/login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu đăng nhập đến backend
            const response = await axios.post('http://localhost:5000/login', { email, password });

            // Nếu đăng nhập thành công, lưu token vào localStorage hoặc sessionStorage
            if (response.data.message === 'Đăng nhập thành công') {
                navigate('/header');
            }
        } catch (error) {
            console.error('Đăng nhập thất bại:', error);
        }
    };

    const goToSignup = () => {
        navigate('/signup'); // Điều hướng đến trang đăng ký
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <h1>FriendSpace</h1>
                    <p>FriendSpace giúp bạn tương tác với bạn bè và người thân</p>
                </div>
                <div className="login-right">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email hoặc số điện thoại"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-login">Đăng nhập</button>
                        <a href="/" className="forgot-password">Quên mật khẩu?</a>
                        <button type="button" className="btn-signup" onClick={goToSignup}>Tạo tài khoản mới</button>
                    </form>
                </div>
            </div>
            <footer className="login-footer">
                <p>Ứng Dụng Quản Lý Hẹn Hò và Tương Tác Xã Hội</p>
            </footer>
        </div>
    );
};

export default Login;