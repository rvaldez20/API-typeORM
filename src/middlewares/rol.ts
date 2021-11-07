import { Request, Response, NextFunction} from 'express';
import {User} from '../entity/User';
import { getRepository } from 'typeorm';

export const checkRol = (roles: string[]) => {

   return async (req: Request, res: Response, next: NextFunction) => {
      const {userId} = res.locals.jwtPayload;
      const userRepository = getRepository(User);

      let user: User;

      try {
         user = await userRepository.findOneOrFail(userId);
      } catch (e) {
         res.status(401).json({message: 'No Autorized'})
      }

      // obtenemos el rol del usuario que recuperamos d ela db
      const {role} = user;
      if(roles.includes(role)){
         next();
      } else {
         res.status(401).json({message: 'No Autorized (Insufficient Privileges)'})
      }

   }

}