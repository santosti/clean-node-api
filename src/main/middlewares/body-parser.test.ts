import request from 'supertest';
import app from '../config/app';

describe('Body Parser Middleware', () => {
  test('should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send({ name: 'Simone' });
    });
    await request(app)
      .post('/test-body-parser')
      .send({ name: 'Simone' })
      .expect({ name: 'Simone' });
  });
});
