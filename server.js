
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // db.js에서 가져온 MySQL 연결

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 스토어 설정
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            httpOnly: true,
            secure: false, // HTTPS 환경에서는 true로 변경
            maxAge: 24 * 60 * 60 * 1000, // 1일
        },
    })
);

// CORS 설정
app.use(cors({
    origin: '*', // 허용할 프론트엔드 URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    credentials: true // 쿠키 포함 여부
}));

// 디버깅용 세션 데이터 출력
app.use((req, res, next) => {
    console.log('Session data:', req.session); // 세션 데이터 확인
    next();
});

// 루트 경로
app.get('/', (req, res) => {
    res.send('Welcome to the Address Book API!');
});

// 라우트 설정
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');

app.use('/api/auth', authRoutes); // 인증 관련 라우트
app.use('/api/contacts', contactRoutes); // 연락처 관련 라우트

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
