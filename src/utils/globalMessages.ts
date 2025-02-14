export const ResponseMessages = {
  success: (message: string, status_code = 200, data?: JSON) => ({
    status: "success",
    status_code,
    message,
    data: data || null,
  }),
  error: (message: string, status_code = 400) => ({
    status: "error",
    status_code,
    message,
  }),
};