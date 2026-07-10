import * as accountRepository from "../repository/account.repository.js";
import { hashPassword, verifyPassword } from "../utils/password.util.js";

function normalizeRole(role) {
  return String(role).trim().toUpperCase();
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function toPlainUser(user) {
  return typeof user?.toJSON === "function" ? user.toJSON() : user;
}

export async function register(body = {}) {
  const existingUser = await accountRepository.findByLogin(body.login);

  if (existingUser) {
    const error = new Error(`User with login "${body.login}" already exists.`);
    error.status = 409;
    throw error;
  }

  return accountRepository.create({
    login: body.login,
    passwordHash: hashPassword(body.password),
    firstName: body.firstName,
    lastName: body.lastName,
    roles: ["USER"],
  });
}

export async function getUser(login) {
  return accountRepository.findByLogin(login);
}

export async function authenticate(credentials = {}) {
  const user = await accountRepository.findByLogin(credentials.login, {
    includePasswordHash: true,
  });

  if (!user || !verifyPassword(credentials.password, user.passwordHash)) {
    throw createHttpError(401, "Invalid login or password.");
  }

  return toPlainUser(user);
}

export async function login(credentials = {}) {
  return authenticate(credentials);
}

export async function addRole(login, role) {
  return accountRepository.updateByLogin(login, {
    $addToSet: {
      roles: normalizeRole(role),
    },
  });
}

export async function deleteRole(login, role) {
  return accountRepository.updateByLogin(login, {
    $pull: {
      roles: normalizeRole(role),
    },
  });
}

export async function updateUser(login, body = {}) {
  const update = {};

  if (body.firstName !== undefined) {
    update.firstName = String(body.firstName).trim();
  }

  if (body.lastName !== undefined) {
    update.lastName = String(body.lastName).trim();
  }

  if (Object.keys(update).length === 0) {
    return accountRepository.findByLogin(login);
  }

  return accountRepository.updateByLogin(login, update);
}

export async function deleteUser(login) {
  return accountRepository.deleteByLogin(login);
}

export async function changePassword(authUser, currentPassword, newPassword) {
  const userWithPassword = await accountRepository.findByLogin(authUser.login, {
    includePasswordHash: true,
  });

  if (!userWithPassword || !verifyPassword(currentPassword, userWithPassword.passwordHash)) {
    throw createHttpError(401, "Current password is invalid.");
  }

  await accountRepository.updateByLogin(authUser.login, {
    passwordHash: hashPassword(newPassword),
  });
}

export async function ensureDefaultAdmin() {
  const admin = await accountRepository.findByLogin("admin");

  if (admin) {
    return admin;
  }

  return accountRepository.create({
    login: "admin",
    passwordHash: hashPassword("admin"),
    firstName: "Admin",
    lastName: "User",
    roles: ["ADMIN", "USER"],
  });
}
