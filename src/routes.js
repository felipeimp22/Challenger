import {
  Router
} from 'express';

import SessionController from './controllers/SessionController';
import UserController from './controllers/userController';


import authMiddleware from './middlewares/auth';

const routes = new Router();

routes.get('/', res => {
  return res.status(201).json({
    message: 'API Accenture!'
  });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/find', UserController.find);

routes.put('/usersUpdate', UserController.update);



module.exports = routes;
