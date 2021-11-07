import {Router} from 'express';

import auth from './auth';
import user from './user';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);

// Para loguearse: localhost:3000/auth/login
// cualquier otra: localhost:3000/users

export default routes;