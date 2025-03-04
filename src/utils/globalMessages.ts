import { unauthorized } from "next/navigation";

export const ResponseMessages = {
  Success: (message: string, status_code = 200, data?: object) => ({
    response: {
      status_code,
      status_description: message,
      result: data || null,
    },
    options: {
      status: status_code,
    },
  }),
  Created: (message: string, status_code = 201) => ({
    response: {
      status_code,
      status_description: message,
    },
    options: {
      status: status_code,
    },
  }),
  ErrorBadRequest: (message: string, status_code = 400) => ({
    response: {
      status_code,
      status_description: message,
    },
    options: {
      status: status_code,
    },
  }),
  ErrorUnauthorized:(message: string, status_code = 401) => ({
    response: {
      status_code,
      status_description: message || unauthorized,
    },
    options: {
      status: status_code,
    },
  })
};
