const mysql = require('mysql2'); // mysql2 패키지 사용

const pool = mysql.createPool({
  host: 'mysql-service',  // Kubernetes 서비스 이름을 사용
  port: 3306,             // MySQL의 기본 포트
  user: 'root',           // MySQL 사용자 이름
  password: 'root1234!!', // 비밀번호
  database: 'addressbook' // 데이터베이스 이름
});
module.exports = pool;