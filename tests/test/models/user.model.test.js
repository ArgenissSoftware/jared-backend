const UserModel = require("../../../server/src/models/user.model");

test('Valid user, all fields required filled', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    email: "testUser@argeniss.com",
    name: "testName",
    surname: "testSurname",
    birthday: '01-01-1990',
  }));

  expect(resp.error).toBeUndefined()
});

test('Invalid user, username is required', () => {
  var resp = UserModel.validateUser(new UserModel({
    email: "testUser@argeniss.com",
    name: "testName",
    surname: "testSurname",
    birthday: '01-01-1990',
  }));

  expect(resp.error.details[0].message).toBe('"username" is required')
});

test('Invalid user, email is required', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    name: "testName",
    surname: "testSurname",
    birthday: '01-01-1990',
  }));

  expect(resp.error.details[0].message).toBe('"email" is required')
});

test('Invalid user, name is required', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    email: "testUser@argeniss.com",
    surname: "testSurname",
    birthday: '01-01-1990',
  }));

  expect(resp.error.details[0].message).toBe('"name" is required')
});

test('Invalid user, surname is required', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    email: "testUser@argeniss.com",
    name: "testName",
    birthday: '01-01-1990',
  }));

  expect(resp.error.details[0].message).toBe('"surname" is required')
});

test('Invalid user, birthday is required', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    email: "testUser@argeniss.com",
    name: "testName",
    surname: "testSurname",
  }));

  expect(resp.error.details[0].message).toBe('"birthday" is required')
});

test('Invalid user, email does not contain @', () => {
  var resp = UserModel.validateUser(new UserModel({
    username: "testUserName",
    email: "testUserargeniss.com",
    name: "testName",
    surname: "testSurname",
    birthday: '01-01-1990',
  }));

  expect(resp.error).not.toBeUndefined()
});