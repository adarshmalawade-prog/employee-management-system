import request from 'supertest';
import app from '../src/app';
import * as db from '../src/config/database';

describe('Health and Root Endpoints', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /', () => {
    it('should return API metadata and status 200', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Employee Management System API');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /api/health', () => {
    it('should return healthy status 200 when database is connected', async () => {
      jest.spyOn(db, 'query').mockResolvedValueOnce({
        rows: [{ '?column?': 1 }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.services.api).toBe('up');
      expect(res.body.services.database).toBe('connected');
      expect(typeof res.body.services.dbLatencyMs).toBe('number');
    });

    it('should return 503 unhealthy status when database connection fails', async () => {
      jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection refused'));

      const res = await request(app).get('/api/health');
      expect(res.status).toBe(503);
      expect(res.body.status).toBe('unhealthy');
      expect(res.body.services.database).toBe('disconnected');
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not Found');
    });
  });
});
