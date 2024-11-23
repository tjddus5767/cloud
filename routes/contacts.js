// const express = require('express');
// const router = express.Router();
// const pool = require('../db');

// // 연락처 추가
// router.post('/', async (req, res) => {
//     console.log('Session in contact addition:', req.session);
//     if (!req.session.userId) {
//         console.error('Session userId is missing');
//         return res.status(401).json({ error: 'User not logged in' });
//     }

//     const { name, email, phone } = req.body;

//     try {
//         const [result] = await pool.query(
//             'INSERT INTO contacts (name, email, phone, user_id) VALUES (?, ?, ?, ?)',
//             [name, email, phone, req.session.userId]
//         );

//         res.status(201).json({ id: result.insertId, name, email, phone });
//     } catch (err) {
//         console.error('Error inserting contact:', err);
//         res.status(500).json({ error: 'Failed to add contact' });
//     }
// });



// // 연락처 목록 조회
// router.get('/', async (req, res) => {
//     try {
//         const [contacts] = await pool.query(
//             'SELECT * FROM contacts WHERE user_id = ?',
//             [req.session.userId] // session.userId로 사용자별 연락처 필터링
//         );
//         res.json(contacts);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to fetch contacts' });
//     }
// });

// module.exports = router;
// 연락처 추가
const express = require('express');
const router = express.Router(); // 라우터 선언
const pool = require('../db');

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

        res.json(contacts);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

module.exports = router;
