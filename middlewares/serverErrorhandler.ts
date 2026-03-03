import type { ErrorRequestHandler } from "express";

interface CustomError extends Error {
  statusCode?: number;
  status?: number;
}

const serverErrorHandler: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next,
) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default serverErrorHandler;
