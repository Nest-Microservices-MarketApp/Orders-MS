import { IResponse } from '../index';

export class ResponseDto<T> implements IResponse {
  statusCode: number;

  message: string;

  response: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.response = data;
  }
}
