import request from 'supertest';
import app from '../src/app';
import * as db from '../src/config/database';

describe('Employee API Endpoints', () => {
  const sampleEmployee = {
    id: 1,
    employee_id: 'EMP-1001',
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice.smith@example.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    salary: 115000.0,
    hire_date: '2022-03-15',
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/employees', () => {
    it('should return a list of employees', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [sampleEmployee],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).get('/api/employees');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data).toEqual([sampleEmployee]);
    });

    it('should apply search and filter query parameters', async () => {
      const querySpy = jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [sampleEmployee],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).get('/api/employees?search=Alice&department=Engineering&role=Senior');
      expect(res.status).toBe(200);
      expect(querySpy).toHaveBeenCalled();
      const calledSql = querySpy.mock.calls[0][0];
      const calledParams = querySpy.mock.calls[0][1];
      expect(calledSql).toContain('ILIKE');
      expect(calledParams).toEqual(['%Alice%', 'Engineering', 'Senior']);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return an employee by valid ID', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [sampleEmployee],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).get('/api/employees/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employee_id).toBe('EMP-1001');
    });

    it('should return 404 if employee does not exist', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const res = await request(app).get('/api/employees/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });

    it('should return 400 for an invalid ID format', async () => {
      const res = await request(app).get('/api/employees/abc');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid employee ID');
    });
  });

  describe('POST /api/employees', () => {
    const validPayload = {
      employee_id: 'EMP-2001',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '+1-555-0202',
      department: 'Marketing',
      role: 'Content Specialist',
      salary: 75000,
      hire_date: '2023-04-10',
    };

    it('should create a new employee when payload is valid', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [{ id: 2, ...validPayload, created_at: '2023-04-10', updated_at: '2023-04-10' }],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).post('/api/employees').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('jane.doe@example.com');
    });

    it('should reject creation with 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/employees').send({
        first_name: 'Jane',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should reject creation with 400 if email is invalid', async () => {
      const res = await request(app).post('/api/employees').send({
        ...validPayload,
        email: 'not-an-email',
      });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('email is required and must be a valid email address.');
    });

    it('should reject creation with 400 if salary is negative', async () => {
      const res = await request(app).post('/api/employees').send({
        ...validPayload,
        salary: -500,
      });
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('salary is required and must be a positive number.');
    });

    it('should return 409 Conflict if employee_id or email already exists', async () => {
      const conflictError: any = new Error('duplicate key value violates unique constraint');
      conflictError.code = '23505';
      conflictError.detail = 'Key (email)=(alice.smith@example.com) already exists.';
      jest.spyOn(db, 'query').mockRejectedValueOnce(conflictError);

      const res = await request(app).post('/api/employees').send(validPayload);
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Conflict');
      expect(res.body.message).toContain('email address already exists');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      // First query in update is findById
      jest.spyOn(db, 'query')
        .mockResolvedValueOnce({
          rows: [sampleEmployee],
          command: 'SELECT',
          rowCount: 1,
          oid: 0,
          fields: [],
        })
        // Second query is UPDATE
        .mockResolvedValueOnce({
          rows: [{ ...sampleEmployee, role: 'Lead Software Engineer' }],
          command: 'UPDATE',
          rowCount: 1,
          oid: 0,
          fields: [],
        });

      const res = await request(app)
        .put('/api/employees/1')
        .send({ role: 'Lead Software Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('Lead Software Engineer');
    });

    it('should return 404 if updating a non-existent employee', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const res = await request(app)
        .put('/api/employees/999')
        .send({ first_name: 'Nobody' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee successfully', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        command: 'DELETE',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).delete('/api/employees/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');
    });

    it('should return 404 if employee to delete does not exist', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [],
        command: 'DELETE',
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const res = await request(app).delete('/api/employees/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
