import {Request, Response, NextFunction } from "express";
import { LogError } from "../common/types/error_types";
import { createHmac } from "crypto";
import { APP_CONFIGS } from "../common/config";
import { parseTimestamp } from "../common/utils/helper_func";


export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {

  // also verify that the user is authenticated
  const requestHeaders = JSON.stringify(req.headers)
  console.log(`request-headers - ${requestHeaders}`, )
  if (!req.headers['x-gateway-timestamp'] || !req.headers['x-gateway-signature'])  {

    throw new LogError('credentials not found', 400);
  }
  const serviceName = req.headers['x-service-name'];
  const recievedTimestamp = req.headers['x-gateway-timestamp'] as string;
 
  const signature = req.headers['x-gateway-signature'];
 // const normaliseTimestamp = Array.isArray(recievedTimestamp) ? recievedTimestamp.join('') : recievedTimestamp

  const headerKeys = `${serviceName}:${recievedTimestamp}`

  const verifySignature = createHmac("sha256", APP_CONFIGS.GATEWAY_SECRET_KEY )
                         .update(headerKeys)
                         .digest("hex");

    if (signature !== verifySignature) {
      throw new LogError('unathorised to access this resource', 403)
    }

    const modTimestamp = parseTimestamp(recievedTimestamp, 30) 
    const currentTimestamp = Date.now()  
    if (modTimestamp < currentTimestamp )  {
      throw new LogError('your time has expired', 403)
    } 

    next();
}

