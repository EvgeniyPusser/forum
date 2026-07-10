import * as accountService from "../services/account.service.js";
import { readBasicCredentials } from "../utils/auth.util.js";

export async function register(request, response) {
  const user = await accountService.register(request.body);

  response.status(201).json(user);
}

export async function login(request, response) {
  const credentials = readBasicCredentials(request.headers.authorization);

  if (!credentials?.login) {
    response.sendStatus(401);
    return;
  }

  const user = await accountService.login(credentials);

  response.status(200).json(user);
}

export async function getUser(request, response) {
  const user = await accountService.getUser(request.params.user);

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(user);
}

export async function addRole(request, response) {
  const user = await accountService.addRole(request.params.user, request.params.role);

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(user);
}

export async function deleteRole(request, response) {
  const user = await accountService.deleteRole(request.params.user, request.params.role);

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(user);
}

export async function updateUser(request, response) {
  const user = await accountService.updateUser(request.params.user, request.body);

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(user);
}

export async function deleteUser(request, response) {
  const user = await accountService.deleteUser(request.params.user);

  if (!user) {
    response.sendStatus(404);
    return;
  }

  response.status(200).json(user);
}

export async function changePassword(request, response) {
  await accountService.changePassword(
    request.authUser,
    request.headers["x-password"],
    request.body.password,
  );

  response.sendStatus(204);
}
