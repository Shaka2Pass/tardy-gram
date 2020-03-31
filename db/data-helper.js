require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const fs = require('fs');
// const seed = require('../db/seed');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

afterAll(() => {
  return mongoose.connection.close();
});

const agent = request.agent(app);
beforeEach(() => {
  return agent
    .post('/api/v1/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password'
    });
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = model => JSON.parse(JSON.stringify(model));
const prepareAll = models => models.map(prepare);

// reading our models directory
const files = fs.readdirSync('./lib/models');
const getters = files
  // for each file in our models directory import the model
  .map(file => require(`../lib/models/${file}`))
  // make sure that what we imported is actually a model
  .filter(Model => Model.prototype instanceof mongoose.Model)
  // for each model create a getModelName function that returns an instance of our model
  .reduce((acc, Model) => {
    return {
      ...acc,
      [`get${Model.modelName}`]: (query, select) => Model.findOne(query).select(select).then(prepare),
      [`get${Model.modelName}s`]: (query, select) => Model.find(query).select(select).then(prepareAll)
    };
  }, {});

module.exports = {
  ...getters,
  getAgent: () => agent
};

