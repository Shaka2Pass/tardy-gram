const { getUser, getAgent } = require('../db/data-helper');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
//Sign up a user. 
describe('auth routes', () => { 
  it('signs up a user', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'will@will.com',
        password: 'willWasHere',
        profilePhotoUrl: 'dog.jpg'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'will@will.com',
          profilePhotoUrl: expect.any(String),
          __v:0 
        });
      });
  });
  //Log in known user from our seed.js
  it('logs in a user', async() => {
    await User.create({
      username: 'test@test.com',
      password: 'password',
      profilePhotoUrl: 'cat.jpeg'
    });
  
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'test@test.com',
        password: 'password',
        profilePhotoUrl: 'cat.jpeg'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test@test.com',
          profilePhotoUrl: 'cat.jpeg',
          __v: 0
        });
      });
  });



});

