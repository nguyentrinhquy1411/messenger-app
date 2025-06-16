class ApiResponse {
  static success(data, message = "Success", statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(message = "Error", statusCode = 500, errors = null) {
    return {
      success: false,
      message,
      statusCode,
      errors,
    };
  }

  static paginated(data, pagination, message = "Success") {
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }
}

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export { ApiResponse, ApiError };
