import express, { Router } from "express";

import axios from 'axios';
import UserController from './controllers/userController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/usersUpdate', UserController.update);

module.exports = routes;
