import { Router } from 'express';

import UserController from './controllers/userController';
import UserCompany from './controllers/userCompany';
import SessionController from './controllers/SessionController';

import authMiddleware from './middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.status(201).json({ message: 'API AppHour! version: 0.0.1' });
});

routes.post('/users', UserController.store);
routes.post('/company', UserCompany.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/usersUpdate', UserController.update);

routes.get('/company', UserCompany.index);
routes.put('/company', UserCompany.update);
routes.put('/company/:id', UserCompany.delete);

module.exports = routes;
