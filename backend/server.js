const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');
const session = require('express-session');
const app = express();
const port = 5000;
let events = [];
let currentEventId = 1;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: '123', // Mã bí mật để mã hóa session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Endpoint tạo sự kiện
app.post('/create-event', (req, res) => {
    const { title, date, time, location, invitedFriends } = req.body;

    if (!title || !date || !time || !location) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo sự kiện' });
    }

    const newEvent = {
        id: currentEventId++,
        title,
        date,
        time,
        location,
        invitedFriends: invitedFriends || [],
    };

    events.push(newEvent);
    res.status(201).json(newEvent); // Trả về sự kiện vừa tạo
});

// Endpoint lấy danh sách sự kiện (nếu cần)
app.get('/events', (req, res) => {
    res.json(events);
});

// Route lấy sự kiện theo id
app.get('/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);

    if (event) {
        res.json(event);
    } else {
        res.status(404).send('Sự kiện không tìm thấy');
    }
});

// Giả lập danh sách người dùng
const generateUser = (id) => ({
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    dateOfBirth: faker.date.past(30, new Date(2000, 0, 1)).toISOString().split('T')[0],
    image: faker.image.avatar(),
});

// Giả lập dữ liệu người dùng và tin nhắn
// Giả lập dữ liệu tin nhắn
const generateFakeMessages = (groupId) => (
    Array.from({ length: 20 }, () => ({
        id: faker.string.uuid(), // Dùng faker.string.uuid() thay vì faker.datatype.uuid()
        sender: faker.person.fullName(),
        message: faker.lorem.sentence(),
        timestamp: faker.date.recent(),
    }))
);

// Giả lập tin nhắn cho 20 nhóm khác nhau (ví dụ)
const messages = Array.from({ length: 20 }, (_, i) => generateFakeMessages(i + 1)).flat();


// API trả về tin nhắn giả
app.get('/api/groups/:groupId/messages', (req, res) => {
    const { groupId } = req.params;

    // Sinh dữ liệu giả cho tin nhắn nhóm
    const fakeMessages = generateFakeMessages(groupId);

    res.status(200).json({
        messages: fakeMessages
    });
});

const usersOnline = Array.from({ length: 20 }, (_, i) => generateUser(i + 1));

// Middleware xác thực người dùng
const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }
    next();
};

app.post('/api/groups/:groupId/messages', (req, res) => {
    const { groupId } = req.params;
    const { sender, message } = req.body;

    // Tạo tin nhắn giả mới
    const newMessage = {
        id: faker.datatype.uuid(),
        sender,
        message,
        timestamp: faker.date.recent(),
    };

    // Bạn có thể lưu tin nhắn vào cơ sở dữ liệu giả lập, hoặc trong bộ nhớ (ví dụ: mảng)
    // Ví dụ, đây là cách thêm tin nhắn vào mảng giả lập (cần lưu vào database thực tế khi triển khai):
    console.log(`New message in group ${groupId}:`, newMessage);

    res.status(200).json({
        status: 'Message sent successfully',
        message: newMessage,
    });
});

// Đăng nhập API
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = usersOnline.find(user => user.email === email && user.password === password);

    if (user) {
        req.session.user = user;
        res.json({ message: 'Đăng nhập thành công' });
    } else {
        res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }
});

app.get('/users', (req, res) => {
    res.json(usersOnline); // Trả về danh sách người dùng mà không cần xác thực
});


// Route kiểm tra thông tin người dùng
app.get('/profile', authenticate, (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);  // Trả về thông tin người dùng từ session
    } else {
        res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }
});

// Route lấy danh sách bạn bè (chưa có dữ liệu thật, chỉ trả về mock)
app.get('/friends', authenticate, (req, res) => {
    const friends = []; // Tạm thời trả về danh sách bạn bè rỗng
    res.json(friends);
});

// Route tìm kiếm bạn bè
app.get('/search-friends', authenticate, (req, res) => {
    const searchTerm = req.query.term;
    const friends = usersOnline.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    res.json(friends);
});

// Gửi yêu cầu kết bạn
app.post('/friend-request', authenticate, (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
    }
    const recipient = usersOnline.find(user => user.id === userId);
    if (!recipient) {
        return res.status(404).send({ message: "User not found" });
    }

    // Giả lập gửi yêu cầu kết bạn
    console.log(`Friend request sent to userId: ${userId}`);

    res.status(200).send({ message: 'Friend request sent', name: recipient.name });
});

// Chấp nhận yêu cầu kết bạn
app.post('/accept-friend-request', authenticate, (req, res) => {
    const { userId } = req.body;
    const user = usersOnline.find(user => user.id === userId);

    if (user) {
        res.json({ message: 'Bạn đã chấp nhận kết bạn với ' + user.name });
    } else {
        res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
});

// Từ chối yêu cầu kết bạn
app.post('/reject-friend-request', authenticate, (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    res.status(200).send('Yêu cầu đã bị từ chối');
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
