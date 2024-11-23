const express = require('express');
const router = express.Router();
const pool = require('../db'); // db.js에서 연결 풀 가져오기

// 연락처 추가
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;

    console.log('Contact data received:', { name, email, phone });
    console.log('Session UserId:', req.session.userId);

    // 로그인되지 않은 사용자일 경우
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    // 입력값 검증
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // MySQL 쿼리 실행하여 연락처 추가
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, phone, user_id) VALUES (?, ?, ?, ?)',
            [name, email, phone, req.session.userId]
        );

        // 연락처 추가 성공 시 응답
        res.status(201).json({ id: result.insertId, name, email, phone });
    } catch (err) {
        console.error('Error inserting contact:', err);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

// 연락처 목록 조회
router.get('/', async (req, res) => {
    // 로그인되지 않은 사용자일 경우
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        // MySQL 쿼리 실행하여 사용자에 해당하는 연락처 목록 조회
        const [contacts] = await pool.query(
            'SELECT * FROM contacts WHERE user_id = ?',
            [req.session.userId]
        );

        // 연락처 목록 응답
        res.json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

module.exports = router;
