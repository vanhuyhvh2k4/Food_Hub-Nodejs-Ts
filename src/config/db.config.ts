import mysql from 'mysql2';
import "dotenv/config";

// Tạo một biến kết nối đến database
const db = mysql.createConnection({
  host: process.env.DB_HOST!, // Host của phpMyAdmin
  user: process.env.DB_USER!, // Tên đăng nhập
  password: process.env.DB_PASSWORD!, // Mật khẩu
  database: process.env.DB_NAME! // Tên database
});

// Kết nối đến database
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối: ' + err.stack);
    return;
  }
  console.log('Kết nối thành công đến database!');
});

// Xuất db để sử dụng trong ứng dụng của bạn
export default db;
