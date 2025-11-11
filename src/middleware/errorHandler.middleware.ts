import { UrlError } from "@/utils/UrlError";
import { ErrorRequestHandler, Response } from "express";

const responder = (res : Response, statusCode : number, message : string | string[] , err_name : string) =>{
  return res.status(statusCode).json({
    success : false,
    statusCode : statusCode,
    error : message,
    error_name : err_name
  });
}
export const errorHandler : ErrorRequestHandler = (err : Error ,_req, res, _next ) =>{
  if(err instanceof UrlError){
    return responder(res,err.statusCode,err.message,err.name);
  }
  return responder(res, 500, err.message , err.name);
}
