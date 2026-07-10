export function readBasicCredentials(authorizationHeader = "") {
  if (!authorizationHeader.startsWith("Basic ")) {
    return null;
  }

  const encodedCredentials = authorizationHeader.slice(6).trim();

  if (!encodedCredentials) {
    return null;
  }

  const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
  const separatorIndex = decodedCredentials.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  return {
    login: decodedCredentials.slice(0, separatorIndex),
    password: decodedCredentials.slice(separatorIndex + 1),
  };
}
