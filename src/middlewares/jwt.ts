import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {

   // console.log('REQ->', req.headers)

   const token = <string>req.headers['auth'];  // header mandara un parametro llamado auth
   let jwtPayload;
 
   try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
      // creamos una variable locales en node con .locals
      res.locals.jwtPayload = jwtPayload
   } catch (e) {
      return  res.status(401).json({message: 'No Autorized'})
   }

   const {userId, username} = jwtPayload;
   const newToken = jwt.sign({userId, username}, config.jwtSecret, {expiresIn: '1h'});
   res.setHeader('token', newToken);

   //y ejecutamo el next para pasar al siguiente middelware
   next();

}