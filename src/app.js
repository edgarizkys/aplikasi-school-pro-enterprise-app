// app.js
const express = require('express');
const { createClient } = require('@libsql/client');
const app = express();

app.use(express.json());

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Middleware: Multi-tenant header
const getTenant = (req) => req.headers['x-school-id'] || 'default';

// CRUD Students
app.get('/api/students', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const rs = await db.execute({
      sql: 'SELECT * FROM students WHERE tenant_id = ? LIMIT ? OFFSET ?',
      args: [getTenant(req), limit, offset]
    });
    res.json(rs.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/students', async (req, res) => {
  const { name, nis, grade, email } = req.body;
  try {
    await db.execute({
      sql: 'INSERT INTO students (tenant_id, name, nis, grade, email) VALUES (?, ?, ?, ?, ?)',
      args: [getTenant(req), name, nis, grade, email]
    });
    res.status(201).json({ message: 'Siswa ditambahkan' });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// CRUD Teachers
app.get('/api/teachers', async (req, res) => {
  const rs = await db.execute({
    sql: 'SELECT * FROM teachers WHERE tenant_id = ?',
    args: [getTenant(req)]
  });
  res.json(rs.rows);
});

// CRUD Attendance
app.post('/api/attendance', async (req, res) => {
  const { student_id, date, status } = req.body;
  await db.execute({
    sql: 'INSERT INTO attendance (tenant_id, student_id, date, status) VALUES (?, ?, ?, ?)',
    args: [getTenant(req), student_id, date, status]
  });
  res.status(201).json({ message: 'Absensi tercatat' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));