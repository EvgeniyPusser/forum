import { UserModel } from "../models/user.model.js";

function mapDocument(document) {
  if (!document) {
    return null;
  }

  return typeof document.toJSON === "function" ? document.toJSON() : document;
}

export async function create(userData) {
  const user = await UserModel.create(userData);
  return mapDocument(user);
}

export async function findByLogin(login, options = {}) {
  const query = UserModel.findOne({ login });

  if (options.includePasswordHash) {
    query.select("+passwordHash");
  }

  const user = await query;

  if (!user) {
    return null;
  }

  if (options.includePasswordHash) {
    return user;
  }

  return mapDocument(user);
}

export async function updateByLogin(login, update, options = {}) {
  const user = await UserModel.findOneAndUpdate(
    { login },
    update,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );

  return mapDocument(user);
}

export async function deleteByLogin(login) {
  const user = await UserModel.findOneAndDelete({ login });
  return mapDocument(user);
}
