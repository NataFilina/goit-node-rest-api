import User from "../models/user.js";

export async function findUser(email) {
  const user = await User.findOne(email);
  return user;
}

export async function createNewUser(newUser) {
  const createdUser = await User.create(newUser);
  return createdUser;
}

export async function loginUser(id, token) {
  const logUser = await User.findByIdAndUpdate(id, token);
  return logUser;
}

export async function logoutUser(id, token) {
  const outUser = await User.findByIdAndUpdate(id, token);
  return outUser;
}

export async function updateSubscription(contactId, body) {
  const user = await User.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return user;
}
