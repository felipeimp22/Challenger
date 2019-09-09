import { Router } from 'express';

import UserController from './controllers/userController';
import UserCompany from './controllers/userCompany';
import EventsController from './controllers/EventsController';
import SessionController from './controllers/SessionController';

import authMiddleware from './middlewares/auth';

const routes = new Router();

routes.get('/', res => {
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

routes.post('/events', EventsController.store);
routes.get('/events', EventsController.index);
routes.put('/events/:id', EventsController.update);
routes.put('/eventsDeleted/:id', EventsController.delete);

module.exports = routes;
