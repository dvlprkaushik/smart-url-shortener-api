export class UrlError extends Error{
  statusCode: number;
  constructor(statusCode : number , message : string){
    super(message);
    this.name = "UrlError";
    this.statusCode = statusCode;

    if(Error.captureStackTrace){
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
