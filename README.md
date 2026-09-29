# Reading List Web Application & REST API

เว็บแอปพลิเคชันและ REST API สำหรับจัดการรายการหนังสือที่กำลังอ่าน อ่านจบแล้ว หรืออยากอ่าน ช่วยให้ผู้ใช้สามารถบันทึก ค้นหา กรอง ติดตามสถานะการอ่าน และให้คะแนนหนังสือได้อย่างเป็นระบบ

---

## คุณสมบัติของระบบ (Features)

* **จัดการข้อมูลหนังสือ (CRUD Operations):** เพิ่ม ดึงข้อมูล แก้ไขสถานะ/คะแนน และลบหนังสือได้
* **ค้นหาและกรองข้อมูล (Search & Filter):** ค้นหาหนังสือจากชื่อหรือผู้แต่ง และกรองตามสถานะการอ่าน (`reading`, `completed`, `want_to_read`)
* **ความปลอดภัยฝั่ง Client (XSS Protection):** แสดงผลข้อมูลข้อความผ่าน `textContent` เพื่อป้องกันการโจมตีแบบ Cross-Site Scripting
* **Data Validation:** มีระบบตรวจสอบความถูกต้องของข้อมูลที่ส่งเข้า API ทั้งฝั่ง Client และ Server

---

## เทคโนโลยีที่ใช้ (Tech Stack)

* **Backend:** Node.js, Express.js
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)
* **Database/Storage:** JSON File / In-memory Data

---

## วิธีการติดตั้งและการใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
* Node.js (เวอร์ชัน 14 ขึ้นไป)
* npm (ติดตั้งมาพร้อมกับ Node.js)

### 2. การติดตั้ง (Installation)
เปิด Terminal / Command Prompt ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่งติดตั้ง Dependencies:

```bash
npm install
รันคำสั่งเพื่อเปิดใช้งานเซิร์ฟเวอร์:

Bash
npm run dev
มื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ จะปรากฏข้อความ:

Server running at http://localhost:3000

เปิดบราวเซอร์แล้วเข้าไปที่ http://localhost:3000 เพื่อเริ่มใช้งานหน้าเว็บ

รายการ API Endpoints ทั้งหมด (API Reference)GET	/api/books	ดึงรายการหนังสือทั้งหมด (รองรับ Query ?status=...)	200 OK
GET	/api/books/:id	ดึงข้อมูลหนังสือรายเล่มตาม ID	200 OK / 404 Not Found
POST	/api/books	เพิ่มหนังสือเล่มใหม่	201 Created / 400 Bad Request
PATCH	/api/books/:id	อัปเดตสถานะการอ่าน หรือคะแนนหนังสือ	200 OK / 400 Bad Request / 404 Not Found
DELETE	/api/books/:id	ลบหนังสือออกจากระบบ	204 No Content / 404 Not Found

ผลการทดสอบ API (API Testing Screenshots)รายการทดสอบภาพประกอบ1. GET /api/booksดึงรายการทั้งหมด (200)2. GET /api/books?status=readingกรองตามสถานะ (200)3. GET /api/books/1ดึงหนังสือรายเล่ม (200)4. GET /api/books/999ไม่พบหนังสือ (404)5. POST /api/booksเพิ่มหนังสือสำเร็จ (201)6. POST /api/booksไม่ส่ง title (400)7. PATCH /api/books/1แก้ไขสถานะและคะแนน (200)8. PATCH /api/books/1ส่ง status ผิดค่า (400)9. DELETE /api/books/2ลบสำเร็จ (204)10. DELETE /api/books/2ลบซ้ำอีกครั้ง ไม่พบหนังสือ (404)
หน้าเว็บแอปพลิเคชัน (Web Application Interfaces)
หน้าเว็บเรียกใช้ API ผ่าน fetch() ทั้งหมด และสร้างการ์ดหนังสือด้วย textContent เพื่อป้องกันการแทรก HTML (XSS)

ภาพที่ 11: หน้าหลักแสดงรายการหนังสือ

ภาพที่ 12: เพิ่มหนังสือใหม่ผ่านฟอร์ม

ภาพที่ 13: โหมดแก้ไขหนังสือ

ภาพที่ 14: กล่องยืนยันก่อนลบ

ภาพที่ 15: ค้นหาด้วยชื่อหรือผู้แต่ง

ภาพที่ 16: กรองตามสถานะ

การดีบักและแก้ไขปัญหา (Debugging Log)
1. ปัญหาฝั่งเซิร์ฟเวอร์: package.json ผิดรูปแบบ
อาการ: รัน npm run dev แล้วขึ้น Invalid package.json ... line 10 column 3 เซิร์ฟเวอร์ไม่เริ่มทำงาน

การตรวจสอบ: อ่านข้อความ error ที่ระบุบรรทัดและคอลัมน์ แล้วเปิด package.json ดูส่วน scripts

สาเหตุ: ตอนแก้ไข scripts มีเครื่องหมายปีกกาปิด }, ซ้ำเกินมา 1 ชุด ทำให้ไวยากรณ์ JSON ผิด

วิธีแก้: ลบปีกกาที่เกินออก ให้เหลือ }, เพียงชุดเดียว บันทึกไฟล์ และสั่งรันใหม่

ผลลัพธ์: เซิร์ฟเวอร์ขึ้น Server running at http://localhost:3000

2. ปัญหาฝั่งไคลเอนต์: การเชื่อมต่อ API ผิดพลาด
อาการ: กดปุ่มเพิ่ม/แก้ไขหนังสือ หรือโหลดหน้าเว็บแล้วข้อมูลไม่แสดงผล หรือส่งคำขอไปยัง API ไม่สำเร็จ (ขึ้น TypeError ใน Console)

การตรวจสอบ: เปิด DevTools (F12) ดูที่แท็บ Console พบข้อความสีแดง Uncaught (in promise) TypeError: Failed to fetch และตรวจสอบแท็บ Network พบสถานะคำขอขึ้น Failed

สาเหตุ: ระบุ URL ของ API หรือ Port ไม่ถูกต้อง (เช่น ลืมระบุ port 3000 หรือพิมพ์พาธ API ผิด) หรือฝั่ง Server ยังไม่ได้เริ่มทำงาน

วิธีแก้: ตรวจสอบและแก้ไข URL ในฟังก์ชัน fetch() ให้ถูกต้องเป็น http://localhost:3000/api/books และตรวจสอบให้แน่ใจว่าได้เปิดรันเซิร์ฟเวอร์เรียบร้อยแล้ว

ผลลัพธ์: หน้าเว็บสามารถเชื่อมต่อ API ดึงข้อมูลมาแสดงผล และส่งคำขอผ่านฟอร์มได้สำเร็จโดยไม่เกิด error ใน Console#   M i n i - P r o j e c t  
 