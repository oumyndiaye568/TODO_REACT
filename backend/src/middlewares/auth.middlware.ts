import type { Request,Response,NextFunction } from "express";
import jwt ,{type JwtPayload} from "jsonwebtoken"

 const ACCESS_TOKEN = process.env.ACCESS_SECRET || "default_secret_key" as string

 declare global {
 namespace Express {
   interface Request {
     user?: string | JwtPayload;
   }
 }
}

export const authMidlleware = async(req:Request,res:Response,next:NextFunction)=>{
    console.log("Auth middleware called");
    const headers = req.headers["authorization"]
    console.log("Authorization header:", headers);

    if (!headers)
    {
       console.log("No authorization header");
       return res.status(401).json({message:"token manquant"})
    }

    const accesstoken =  headers?.split(" ")[1] as string
    console.log("Access token:", accesstoken);

    if (!accesstoken)
    {
       console.log("No access token");
       return res.status(401).json({message:"token invalide ou manquant"})
    }


    try
    {
      console.log("Verifying token with secret:", ACCESS_TOKEN);
      const decoded = jwt.verify(accesstoken,ACCESS_TOKEN) as JwtPayload
      console.log("Decoded user:", decoded);
      req.user = decoded

     return  next()

    } catch (error)
    {
      console.log("Token verification failed:", error);
      return res.status(403).json({ message: "token invalide" });
    }

      

}