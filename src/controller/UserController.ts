import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from "class-validator";

export class UserController {

    // getAll
    static getAll = async(req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;

        try {
            users = await userRepository.find();  
            
        } catch (e) {
            return res.status(404).json({message: 'No result'});    
        }

        if (users.length > 0){
            res. send(users);          
        } else {
            return res.status(404).json({message: 'Somthing is wrong!'});
        }
        
    }

    // getById
    static getById = async(req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
            
        } catch (e) {
            return res.status(404).json({message: 'No result'});  
        }
    }

    // newUser
    static newUser = async(req: Request, res: Response) => {
        const {username, password, role} = req.body;
        const user = new User();
        
        user.username = username;
        user.password = password;
        user.role = role;

        // validates
        const validatioOptions = {validationError: {target:false, value: false}}
        const errors = await validate(user, validatioOptions);
        if (errors.length > 0){
            return res.status(400).json(errors);
        }


        const userRepository = getRepository(User);
        try {
            // se ejecuta con la instacia user de la clase (lin 42)
            user.hashPassword(); // se hashea la contraseña
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({message: 'Username already exist'});  
        }

        res.send('User created');
    }
    
    //editUser
    static editUser = async(req: Request, res:Response) => {
        let user;
        const {id} = req.params;
        const {username, role} = req.body;

        const userRepository = getRepository(User);

        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;
        } catch (e) {
            return res.status(404).json({message: 'User not found'})
        }

        const validatioOptions = {validationError: {target:false, value: false}}
        const errors = await validate(user, validatioOptions);
        // console.log('ERROR->', errors)

        if(errors.length > 0){
            return res.status(400).json(errors)
        }

        // si el usurio existe y no hay errore guardamos la modificacion
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({message: 'Username already in use'})
        }

        res.status(201).json({message: 'User Update'})
    }

    //deleteUser
    static deleteUser = async(req: Request, res:Response) => {
        const {id} = req.params;
        const userRepository = getRepository(User);

        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({message: 'Username not found'});
        }

        userRepository.delete(id);
        res.status(201).json({message: 'User deleted'});
    }
}

export default UserController;