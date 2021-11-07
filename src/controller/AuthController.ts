import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator'

import config from '../config/config'
import { User } from '../entity/User';

class AuthController {

   static login = async(req: Request, res: Response) => {
      const {username, password} = req.body;

      // comprobamos que tengamos un username y password
      if ( !(username && password) ){
         return res.status(400).json({message: 'Username & Password are required!'})
      }

      // verificamos en la DB
      const userRepository = getRepository(User);
      let user: User;

      try {
         user = await userRepository.findOneOrFail({
            where: {username}
         })
      } catch (e) {
         return res.status(400).json({message: `Username or Password Incorrect!`})
      }

      // match del password
      if(!user.checkPassword(password)){
         return res.status(400).json({message: `Username or Password Incorrect!`})
      }

      const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'})

      res.json({message: 'OK', token});
   }

   static changePassword = async(req: Request, res: Response) => {

      const {userId} = res.locals.jwtPayload;
      const {oldPassword, newPassword} = req.body;

      // se valida que se incluyan los password
      if(!(oldPassword && newPassword)){
         return res.status(400).json({message: 'Old Password & new Password are required'})
      }

      // si se envian contraseñas correctamente
      const userRepository = getRepository(User);
      let user: User;

      try {
         user = await userRepository.findOneOrFail(userId)
      } catch (e) {
         res.status(401).json({message: 'Somthing goes wrong'});
      }

      // se valida la contraseña
      if(!user.checkPassword(oldPassword)){
         return res.status(401).json({message: 'Check your old Password'});
      }

      // si oldPaswword es correcta
      user.password = newPassword;
      const validationOptions = {validationError: {target:false, value:false}}
      const errors = await validate(user, validationOptions);

      if (errors.length > 0){
         res.status(400).json(errors);
      }

      // si no hay errores ahora se hace un hash
      user.hashPassword();
      userRepository.save(user);

      res.json({message: 'Password updated correctly'})

   }
}

export default AuthController;