const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');  // mysql2/promise로 변경

const pool = mysql.createPool({
  host: 'mysql-service',  // Kubernetes 서비스 이름
  port: 3306,             // MySQL의 기본 포트
  user: 'root',           // MySQL 사용자 이름
  password: 'root1234!!', // 비밀번호
  database: 'addressbook' // 데이터베이스 이름
});

const router = express.Router();

// 회원가입
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Received data:", req.body);  // 요청 본문 출력

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);  // 오류 출력
    res.status(400).json({ error: 'Error registering user', details: error });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 유효성 검사
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // MySQL에서 사용자 정보 조회
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id; // 세션에 저장
    console.log('User logged in with session:', req.session);

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
