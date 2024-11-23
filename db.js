// db.js
const mysql = require('mysql2/promise');

// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
  host: 'mysql-service',  // MySQL 서비스 이름 (Kubernetes에서 정의한 서비스)
  port: 3306,             // MySQL 기본 포트
  user: 'root',           // 사용자 이름
  password: 'root1234!!', // 데이터베이스 비밀번호
  database: 'addressbook' // 사용할 데이터베이스 이름
});

// 연결 풀 반환
module.exports = pool;
