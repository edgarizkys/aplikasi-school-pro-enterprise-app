# Aplikasi School Pro Enterprise

Enterprise school management system. High performance. Scalable.

## Tech Stack
- **Backend**: Express.js
- **Database**: Turso SQLite (LibSQL)
- **Frontend**: Tailwind CSS
- **Architecture**: Multi-tenant Enterprise Pattern

## Colors
- **Primary**: `#1E40AF` (Deep Blue)
- **Secondary**: `#3B82F6` (Bright Blue)

## Entities
### Students (Siswa)
- `name`: Nama
- `nis`: NIS
- `grade`: Kelas
- `email`: Email

### Teachers (Guru)
- `name`: Nama
- `nip`: NIP
- `subject`: Mata Pelajaran

### Attendance (Absensi)
- `student_id`: ID Siswa
- `date`: Tanggal
- `status`: Status (Hadir/Izin/Sakit/Alpa)

## Features
- **Student Management**: Full CRUD, filter by grade.
- **Teacher Portal**: Subject assignment, class management.
- **Attendance Tracking**: Daily logging, status reporting.
- **Grade Reporting**: Academic performance tracking.
- **Parent Notification**: Automated alerts via system/email.

## Installation

1. **Clone Repo**
   ```bash
   git clone https://github.com/user/school-pro-enterprise.git
   cd school-pro-enterprise
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file:
   ```env
   PORT=3000
   TURSO_DATABASE_URL=libsql://your-db-url.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   JWT_SECRET=your-secret-key
   ```

4. **Database Migration**
   ```bash
   npm run migrate
   ```

5. **Run Application**
   ```bash
   npm start
   ```

## API Endpoints

### Students
- `GET /api/students` - List all students (Pagination supported)
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Remove student

### Teachers
- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Remove teacher

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Log attendance
- `GET /api/attendance/student/:id` - Student history

## Enterprise Patterns
- **Multi-tenancy**: Data isolated by `school_id`.
- **Pagination**: `limit` and `offset` on all list endpoints.
- **Error Handling**: Centralized middleware for HTTP status codes.
- **Validation**: Strict schema validation for all inputs.