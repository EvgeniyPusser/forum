const errorHandler = (error, request, response, _next) => {
  console.error(error.stack);

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: "Invalid JSON body.",
      path: request.originalUrl,
    });
    return;
  }

  if (error.name === "CastError") {
    response.status(404).json({
      timestamp: new Date().toISOString(),
      status: 404,
      error: "Not Found",
      message: "Not found",
      path: request.originalUrl,
    });
    return;
  }

  if (error.name === "ValidationError") {
    response.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: error.message,
      path: request.originalUrl,
    });
    return;
  }

  if (error.status) {
    response.status(error.status).json({
      timestamp: new Date().toISOString(),
      status: error.status,
      error:
        error.status === 409
          ? "Conflict"
          : error.status === 401
            ? "Unauthorized"
            : error.status === 403
              ? "Forbidden"
              : "Error",
      message: error.message,
      path: request.originalUrl,
    });
    return;
  }

  if (error.message?.toLowerCase().includes("not found")) {
    response.status(404).json({
      timestamp: new Date().toISOString(),
      status: 404,
      error: "Not Found",
      message: error.message,
      path: request.originalUrl,
    });
    return;
  }

  response.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    error: "Internal Server Error",
    message: error.message || "Internal server error.",
    path: request.originalUrl,
  });
};

export default errorHandler;
