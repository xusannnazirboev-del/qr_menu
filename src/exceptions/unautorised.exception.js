import { BaseException } from "./base.exception.js";

export class UnautoRisedException extends BaseException {
  constructor(message) {
    super(message)
    this.status = 401
    this.name = "UnautoRised  Exception";
  }
}

