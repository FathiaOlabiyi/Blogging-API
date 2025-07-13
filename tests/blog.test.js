const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");
const user = require("..models/user");
const blog = require("../models/blog");

let token;

beforeAll(async () => {
  await mongoose.connection.dropDatabase();
  const getUser = await request(app).post('/api/signup').send({
    first_name: 'B', last_name: 'U', email: 'bu@test.com', password: 'pass123'
  });
  const login = await request(app).post('/api/login').send({ email: 'bu@test.com', password: 'pass123' });
  token = login.body.token;
});

afterAll(done => mongoose.connection.close(done));

describe('Blog', () => {
  let blogId;

  test('create blog', async () => {
    const res = await request(app).post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T1', body: 'Hello world', tags: ['test'], description: 'desc' });
    expect(res.statusCode).toBe(201);
    blogId = res.body._id;
  });

  test('publish and get blog', async () => {
    const published = await request(app).patch(`/api/blogs/${blogId}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' });
    expect(published.body.state).toBe('published');

    const getRes = await request(app).get(`/api/blogs/${blogId}`);
    expect(getRes.body.read_count).toBe(1);
  });

  test('get published list with filters', async () => {
    const listRes = await request(app).get('/api/blogs?order_by=reading_time&order=asc');
    expect(Array.isArray(listRes.body)).toBe(true);
  });
});
