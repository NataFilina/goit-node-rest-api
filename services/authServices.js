import User from "../models/user.js";

export async function findUser(email) {
  const user = await User.findOne(email);
  return user;
}

export async function createNewUser(newUser) {
  const createdUser = await User.create(newUser);
  return createdUser;
}

export async function logUser(id, token) {
  const user = await User.findByIdAndUpdate(id, token);
  return user;
}
export async function updateUser(contactId, body) {
  const user = await User.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return user;
}
