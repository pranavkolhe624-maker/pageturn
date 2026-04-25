export const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};

export const successResponse = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (res, message, error = null, statusCode = 500) => {
  return sendResponse(res, statusCode, false, message, null, error);
};
