import mysql from 'mysql2';

// Tạo một biến kết nối đến database
const db = mysql.createConnection({
  host: 'localhost', // Host của phpMyAdmin
  user: 'root', // Tên đăng nhập
  password: '', // Mật khẩu
  database: 'food_hub' // Tên database
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
