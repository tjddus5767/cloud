const express = require('express');
const router = express.Router(); // 라우터 선언
const pool = require('../db');

// 연락처 추가
// 연락처 추가
router.post('/', async (req, res) => {
    const { name, email, phone } = req.body;

    console.log('Contact data received:', { name, email, phone });
    console.log('Session UserId:', req.session.userId);

    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO contacts (name, email, phone, user_id) VALUES (?, ?, ?, ?)',
            [name, email, phone, req.session.userId]
        );

        res.status(201).json({ id: result.insertId, name, email, phone });
    } catch (err) {
        console.error('Error inserting contact:', err);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});


// 연락처 목록 조회 (GET)
// 연락처 목록 조회
router.get('/', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    try {
        const [contacts] = await pool.query(
            'SELECT * FROM contacts WHERE user_id = ?',
            [req.session.userId]
        );

        console.log('Contacts fetched:', contacts);  // 로그 추가

        res.json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

module.exports = router;
