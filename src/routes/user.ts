import {Router} from 'express';
import { UserController } from '../controller/UserController';
import {checkJWT} from '../middlewares/jwt';
import { checkRol } from '../middlewares/rol';

const router = Router();

// Get all user
router.get('/', [checkJWT, checkRol(['admin'])], UserController.getAll);

// Get one user
router.get('/:id', [checkJWT, checkRol(['admin'])], UserController.getById);

// create new user
router.post('/', [checkJWT, checkRol(['admin'])], UserController.newUser);

// edit user
router.patch('/:id', [checkJWT, checkRol(['admin'])], UserController.editUser);

// delete user
router.delete('/:id', [checkJWT, checkRol(['admin'])], UserController.deleteUser);

export default router;