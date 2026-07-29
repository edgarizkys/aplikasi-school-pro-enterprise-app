const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

jest.mock('../config/db', () => ({
  execute: jest.fn(),
  all: jest.fn(),
}));

describe('School Pro Enterprise API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Student Management', () => {
    it('should create new student', async () => {
      db.execute.mockResolvedValue({ rowsCount: 1 });
      const res = await request(app)
        .post('/api/students')
        .send({
          name: 'Test Student',
          nis: '9999',
          grade: '10-A',
          email: 'test@school.com'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Siswa berhasil ditambahkan');
    });

    it('should fetch all students with pagination', async () => {
      db.all.mockResolvedValue([
        { id: 1, name: 'Andi Wijaya', nis: '1001', grade: '12-A', email: 'andi@school.com' }
      ]);
      const res = await request(app).get('/api/students?page=1&limit=10');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].name).toBe('Andi Wijaya');
    });

    it('should return 404 for non-existent student', async () => {
      db.all.mockResolvedValue([]);
      const res = await request(app).get('/api/students/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Siswa tidak ditemukan');
    });
  });

  describe('Teacher Portal', () => {
    it('should create new teacher', async () => {
      db.execute.mockResolvedValue({ rowsCount: 1 });
      const res = await request(app)
        .post('/api/teachers')
        .send({
          name: 'Test Teacher',
          nip: '123456',
          subject: 'Informatika'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Guru berhasil ditambahkan');
    });

    it('should fetch all teachers', async () => {
      db.all.mockResolvedValue([
        { id: 1, name: 'Siti Aminah', nip: '198001', subject: 'Matematika' }
      ]);
      const res = await request(app).get('/api/teachers');
      expect(res.statusCode).toBe(200);
      expect(res.body.data[0].subject).toBe('Matematika');
    });
  });

  describe('Attendance Tracking', () => {
    it('should record attendance', async () => {
      db.execute.mockResolvedValue({ rowsCount: 1 });
      const res = await request(app)
        .post('/api/attendance')
        .send({
          student_id: 1,
          date: '2023-10-27',
          status: 'Hadir'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Absensi berhasil dicatat');
    });

    it('should fail if student_id is missing', async () => {
      const res = await request(app)
        .post('/api/attendance')
        .send({
          date: '2023-10-27',
          status: 'Hadir'
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'ID Siswa wajib diisi');
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 internal server error', async () => {
      db.all.mockRejectedValue(new Error('DB Connection Failed'));
      const res = await request(app).get('/api/students');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Terjadi kesalahan pada server');
    });
  });
});