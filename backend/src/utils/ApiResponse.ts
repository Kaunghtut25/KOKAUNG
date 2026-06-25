export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
