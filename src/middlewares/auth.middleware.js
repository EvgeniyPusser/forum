import * as accountService from "../services/account.service.js";
import { readBasicCredentials } from "../utils/auth.util.js";

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function hasRole(user, role) {
  return user?.roles?.includes(role);
}

export async function authenticate(request, response, next) {
  const credentials = readBasicCredentials(request.headers.authorization);

  if (!credentials?.login) {
    response.sendStatus(401);
    return;
  }

  try {
    const user = await accountService.authenticate(credentials);
    request.authUser = user;
    next();
  } catch (error) {
    if (error.status === 401) {
      response.sendStatus(401);
      return;
    }

    next(error);
  }
}

export function requireAdmin(request, _response, next) {
  if (hasRole(request.authUser, "ADMIN")) {
    next();
    return;
  }

  next(createHttpError(403, "Admin role is required."));
}

export function requireModeratorOrAdmin(request, _response, next) {
  if (hasRole(request.authUser, "ADMIN") || hasRole(request.authUser, "MODERATOR")) {
    next();
    return;
  }

  next(createHttpError(403, "Moderator or admin role is required."));
}

export function requireSelf(paramName = "user") {
  return (request, _response, next) => {
    const targetLogin = request.params[paramName];

    if (request.authUser?.login === targetLogin) {
      next();
      return;
    }

    next(createHttpError(403, "Access denied."));
  };
}

export function requireSelfOrAdmin(paramName = "user") {
  return (request, _response, next) => {
    const targetLogin = request.params[paramName];

    if (hasRole(request.authUser, "ADMIN") || request.authUser?.login === targetLogin) {
      next();
      return;
    }

    next(createHttpError(403, "Access denied."));
  };
}
